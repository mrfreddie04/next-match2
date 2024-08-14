'use server';

import { prisma } from "@/lib/prisma";
import { delay } from "@/lib/utils";
import { Member, Like } from "@prisma/client";
import { getAuthUserId } from "./authActions";
import { LikeDto, LikeType } from "@/types";
import { EVENT_LIKE_NEW, pusherServer } from "@/lib/pusher";

export async function toggleLikeMember(targetUserId: string, isLiked: boolean) {
  try {
    //get current user
    const userId = await getAuthUserId();

    if(isLiked) {      
      await prisma.like.delete({
        where: {
          sourceUserId_targetUserId:{sourceUserId:userId,targetUserId}
        }
      });
    } else {
      const likeNew = await prisma.like.create({
        data: {
          sourceUserId:userId,
          targetUserId
        },
        select: {
          sourceMember: { select: {userId: true, name: true, image: true} }
        }  
      });    
      //send notification  
      const likeDto: LikeDto = {
        userId: likeNew.sourceMember.userId,
        name: likeNew.sourceMember.name, 
        image: likeNew.sourceMember.image
      }
      console.log("NEW LIKE PUSH", likeDto.userId)
      const channelNotify = `private-${targetUserId}`;
      await pusherServer.trigger(channelNotify, EVENT_LIKE_NEW, likeDto);      
    }
  } catch(e) {
    console.log(e);
    throw e;    
  }
}

export async function getCurrentUserLikeIds() {
  try {
    //get current user
    const userId = await getAuthUserId();

    const likeIds = await prisma.like.findMany({
      where: { sourceUserId: userId },
      select: { targetUserId: true } 
    });

    return likeIds.map( like => like.targetUserId);

  } catch(e) {
    console.log(e);
    throw e;    
  }  
}  

export async function getCurrentUserLikedMembers(type: string = 'source') {
  try {
    //get current user
    const userId = await getAuthUserId();

    //console.log("Action type", type)

    switch(type) {
      case 'source':
        return await fetchSourceLikes(userId);  
      case 'target':  
        return await fetchTargetLikes(userId);
      case 'mutual':  
        return await fetchMutualLikes(userId);      
      default:
        return [];    
    }

  } catch(e) {
    console.log(e);
    throw e;    
  }  
}  

async function fetchSourceLikes(userId: string) {
  const members = await prisma.like.findMany({
    where: { sourceUserId: userId },
    select: { targetMember: true } 
  });
  return members.map( member => member.targetMember);
}

async function fetchTargetLikes(userId: string) {
  const members = await prisma.like.findMany({
    where: { targetUserId: userId },
    select: { sourceMember: true } 
  });
  return members.map( member => member.sourceMember);  
}

async function fetchMutualLikes(userId: string) {
  const likedUsers = await prisma.like.findMany({
    where: { sourceUserId: userId },
    select: { targetUserId: true } 
  });
  const likedIds = likedUsers.map(like => like.targetUserId);

  const mutualList = await prisma.like.findMany({
    where: { 
      AND: [
        {targetUserId: userId}, 
        {sourceUserId: {in: likedIds}},
      ]
    },
    select: { sourceMember: true } 
  });
  return mutualList.map( member => member.sourceMember);    
}

async function fetchSourceLikes2(userId: string) {
  const members = await prisma.like.findMany({
    where: { 
      sourceUserId: userId, 
      targetMember: {
        sourceLikes: {
          some: {
            sourceUserId: userId,
          }
        },        
      } 
    },
    select: { targetMember: true } 
  });
  return members.map( member => member.targetMember);    
}  