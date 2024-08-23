import React from 'react';
import { getMemberPhotosByUserId } from '@/app/actions/memberActions';
import { CardBody, CardHeader, Divider } from '@nextui-org/react';
import MemberPhotos from '@/components/MemberPhotos';

type Props = {
  params: {
    userId: string
  }         
}  

export default async function MemberPhotosPage({params}: Props) {

  const photos = await getMemberPhotosByUserId(params.userId);
  
  return (
    <>
      <CardHeader className='text-2xl font-semibold text-secondary'>
        Photos          
      </CardHeader>
      <Divider />
      <CardBody>
      <MemberPhotos photos={photos} />
      </CardBody>      
    </>
  );
}
