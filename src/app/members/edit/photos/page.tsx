import React from 'react';
import { CardBody, CardHeader, Divider } from '@nextui-org/react';
import { getAuthUserId, getUserById } from '@/app/actions/authActions';
import { getMemberByUserId, getMemberPhotosByUserId } from '@/app/actions/memberActions';
import MemberPhotoUpload from './MemberPhotoUpload';
import MemberPhotos from '@/components/MemberPhotos';

export default async function MemberEditPhotos() {
  const userId = await getAuthUserId();
  const photos = await getMemberPhotosByUserId(userId);
  const member = await getMemberByUserId(userId);

  // if(!member) {
  //   return notFound();
  // }

  //      console.log("PROPS",member)
  
  return (
    <>
      <CardHeader className='flex flex-row justify-between items-center'>
        <div className='text-2xl font-semibold text-secondary'>
          Edit Profile
        </div>
        <MemberPhotoUpload />
      </CardHeader>
      <Divider />
      <CardBody>
        <MemberPhotos photos={photos} editing={true} mainImageUrl={member?.image} />
      </CardBody>
    </>
  );  
}