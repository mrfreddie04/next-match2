'use server';
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { delay } from "@/lib/utils";
import { Member, Photo } from "@prisma/client";

export async function getMembers(): Promise<Member[] | null> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if(!userId) return null;
    const member = await fetchMemberByUserId(userId);
    if(!member) return null;

    //throw new Error('Just testing...');

    return await prisma.member.findMany({
      where: { 
        gender: member.gender === "female" ? "male" : "female",
        userId: { not: userId }
      }
    })
  } catch(e) {
    console.log(e);
    throw e;
    return null;
  }
}  

export async function getMemberByUserId(userId: string): Promise<Member | null> {
  try {
    return await fetchMemberByUserId(userId);
  } catch(e) {
    console.log(e);
    return null;
  }
}  

export async function getMemberPhotosByUserId(userId: string): Promise<Photo[] | null> {
  try {
    const member = await prisma.member.findUnique({ 
      where: { userId: userId },
      select: { photos: true } 
    });   
    if(!member) return null;
    await delay(500);
    return member.photos; //extract array of protos from the member object
    //return member.photos.map( photo => photo) as Photo[];
  } catch(e) {
    console.log(e);
    return null;
  }  
}

async function fetchMemberByUserId(userId: string) {
  return prisma.member.findUnique({ 
    where: { userId: userId }
  });
}