'use server';

import { prisma } from "@/lib/prisma";
import { delay } from "@/lib/utils";
import { GetMemberParams, PaginatedResponse } from "@/types";
import { Member, Photo } from "@prisma/client";
import { addYears } from "date-fns";
import { getAuthUserId } from "./authActions";

export async function getMembers({
  ageRange = '18,100',
  gender = 'male,female',
  orderBy = 'updatedAt',
  pageNumber = '1',
  pageSize = '12'
}: GetMemberParams): Promise<PaginatedResponse<Member>> {
  try {
    console.log("GetMembers", {pageNumber, pageSize, orderBy, gender, ageRange});
    //will throw if not authorized
    const userId = await getAuthUserId();
    
    //filtering/sorting
    const [minAge, maxAge] = ageRange!.split(",").map( (r:string) => Number(r));
    const currentDate = new Date();
    const minDob = addYears(currentDate, -maxAge-1);
    const maxDob = addYears(currentDate, -minAge);
    const selectedGender = gender!.split(",");
    const selectedOrderBy = orderBy!;

    //paging
    const page =  parseInt(pageNumber!);
    const take= parseInt(pageSize!);
    const skip = (page - 1) * take;

    await delay(500);

    const count = await prisma.member.count({
      where: { 
        userId: { not: userId },
        AND: [
          { dateOfBirth: {gte: minDob}}, 
          { dateOfBirth: {lte: maxDob}},
          { gender: { in: selectedGender }}
        ]  
      }
    });

    const members = await prisma.member.findMany({
      where: { 
        userId: { not: userId },
        AND: [
          { dateOfBirth: {gte: minDob}}, 
          { dateOfBirth: {lte: maxDob}},
          { gender: { in: selectedGender }}
        ]  
      },
      orderBy: { [selectedOrderBy]: 'desc' },
      skip,
      take
    });

    const paginagedResponse: PaginatedResponse<Member> = {
      items: members,
      totalCount: count
    }

    return paginagedResponse;
  } catch(e) {
    console.log(e);
    throw e;
  }
}  

export async function getMemberByUserId(userId: string): Promise<Member | null> {
  try {
    await delay(500);
    //console.log("GMBI");
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

export async function updateLastActive() {
  try {
    const userId = await getAuthUserId();

    return await prisma.member.update({ 
      where: { userId: userId },
      data: { updatedAt: new Date() }
    });  

  } catch(e) {
    console.log(e);
    throw e;
  }  
}

async function fetchMemberByUserId(userId: string) {
  //console.log("UID", userId);
  return prisma.member.findUnique({ 
    where: { userId: userId }
  });
}


    // //filtering/sorting
    // const userFilters: UserFilters = {
    //   ageRange: ageRange!.split(",").map( (r:string) => Number(r)),
    //   gender: gender!.split(",") ,
    //   orderBy: orderBy!
    // }
    // //paging
    // const pagingParams: PagingParams = {
    //   pageNumber: parseInt(pageNumer!), //page
    //   pageSize: parseInt(pageSize!) //limit
    // }