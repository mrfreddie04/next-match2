'use server';

import { prisma } from "@/lib/prisma";
import { delay } from "@/lib/utils";
import { Photo, Role } from "@prisma/client";
import { getUserRole } from "./authActions";
import { cloudinary } from "@/lib/cloudinary";

export async function getUnapprovedPhotos(): Promise<Photo[]> {
  try {
    const role = await getUserRole();
  
    if(role !== Role.ADMIN) throw new Error("Forbidden");

    return prisma.photo.findMany({
      where: { isApproved: false }
    })
  } catch(e) {
    console.log(e)
    throw e;
  }
}  

export async function approvePhoto(photoId: string) {
  try {
    const role = await getUserRole();
  
    if(role !== Role.ADMIN) throw new Error("Forbidden");

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: {
        member: {
          include: { user: true }
        }
      }
    });

    if(!photo || !photo.member || !photo.member.user) {
      throw new Error("Cannot approve this image");
    }

    const { member } = photo;

    const userUpdate = member.user && !member.user.image ? { image: photo.url} : {};
    const memberUpdate = !member.image ? { image: photo.url} : {};

    if(Object.keys(userUpdate).length > 0) {
      await prisma.user.update({
        where: {id: member.userId},
        data: userUpdate
      })
    }

    return prisma.member.update({
      where: { id: member.id },
      data: {
        ...memberUpdate,
        photos: {
          update: {
            where: {id: photoId},
            data: { isApproved: true}
          }
        }
      }
    });
  } catch(e) {
    console.log(e)
    throw e;
  }    
}  

export async function rejectPhoto(photo: Photo) {
  try {
    const role = await getUserRole();
  
    if(role !== Role.ADMIN) throw new Error("Forbidden");
    
    if(photo.publicId) {
      await cloudinary.v2.uploader.destroy(photo.publicId);
    }    

    return prisma.photo.delete({
      where: { id: photo.id }
    });
    
  } catch(e) {
    console.log(e)
    throw e;
  }  
}  