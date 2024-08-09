'use server';

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { MemberEditSchema, memberEditSchema } from "@/lib/schemas/memberEditSchema";
import { ActionResult } from "@/types";
import { Member, Photo } from "@prisma/client";
import { delay } from "@/lib/utils";
import { getAuthUserId } from "./authActions";

export async function updateMemberProfile(data: MemberEditSchema, nameUpdated: boolean): Promise<ActionResult<Member>> {
  try {
    const userId = await getAuthUserId();

    //repeat client-side validation - we can use zod also on the server side, same logic as on the client
    const validated = memberEditSchema.safeParse(data);
    if(!validated.success) {
      return {
        status: "error",
        error: validated.error.errors
      }
    }

    //extract fields to be updated
    const { name, description, city, country } = validated.data;

    //update db
    const member = await prisma.member.update({
      where: { userId: userId },
      data: {
        name, description, city, country
      },
    });

    if(nameUpdated) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: name },
      });      
    }

    return {
      status: "success",
      data: member
    };
  } catch(e) {
    console.log(e); //report on the server side
    return {
      status: "error",
      error: "Something went wrong"
    }    
  }
}

export async function addImage(url: string, publicId: string): Promise<Member> {
  try {
    const userId = await getAuthUserId();

    return await prisma.member.update({
      where: { userId: userId },
      data: {
        photos: {
          create: [
            {
              url,
              publicId
            },            
          ]
        }
      },
    });

  } catch(e) {
    console.log(e); //report on the server side
    throw e;
  }
}

export async function setMainImage(photo: Photo) {
  try {
    const userId = await getAuthUserId();

    await prisma.user.update({
      where: { id: userId },
      data: {
        image: photo.url,
        // member: {
        //   update: {
        //     image: photo.url
        //   },                      
        // }        
      },
    });

    
    const member = prisma.member.update({
      where: { userId: userId },
      data: { image: photo.url}
    });
    
    await delay(500);

    return member;
  } catch(e) {
    console.log(e); //report on the server side
    throw e;
  }
}

export async function deleteImage(photo: Photo) {
  try {
    const userId = await getAuthUserId();

    if(photo.publicId) {
      await cloudinary.v2.uploader.destroy(photo.publicId);
    }  

    return prisma.member.update({
      where: { userId: userId },
      data: {
        photos: {
          delete: [
            {id: photo.id}
          ]
        }      
      }
    });
  } catch(e) {
    console.log(e); //report on the server side
    throw e;
  }
}

export async function getUserInfoForNav() {
  try {
    const userId = await getAuthUserId();
    return await prisma.user.findUnique({ 
      where: { id: userId },
      select: { name: true, image: true } 
    });   
  } catch(e) {
    console.log(e);
    throw e;
  }  
}