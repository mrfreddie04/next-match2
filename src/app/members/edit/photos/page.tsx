import React from 'react';
import { getAuthUserId } from '@/app/actions/authActions';
import { getMemberByUserId, getMemberPhotosByUserId } from '@/app/actions/memberActions';
import MemberPhotoUpload from './MemberPhotoUpload';
import MemberPhotos from '@/components/MemberPhotos';
import CardInnerWrapper from '@/components/CardInnerWrapper';

export default async function MemberEditPhotos() {
  const userId = await getAuthUserId();
  const photos = await getMemberPhotosByUserId(userId);
  const member = await getMemberByUserId(userId);

  // if(!member) {
  //   return notFound();
  // }
  //      console.log("PROPS",member)
  
  const header = (
    <div className='flex flex-row justify-between items-center w-full'>
      <div className='text-2xl font-semibold text-secondary'>
        Edit Profile
      </div>
      <MemberPhotoUpload />
    </div>);

  return (
    <CardInnerWrapper 
      header={header} 
      body={<MemberPhotos photos={photos} editing={true} mainImageUrl={member?.image} />}
    />    
  );  
}