import React from 'react';
import { getMemberPhotosByUserId } from '@/app/actions/memberActions';
import { CardBody, CardHeader, Divider, Image } from '@nextui-org/react';

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
        <div className="grid grid-cols-5 gap-3">
          {photos && photos.map( photo => (
            <div key={photo.id}>
              <Image  
                isZoomed
                alt="Image of member"
                width={200}
                height={200}
                src={photo.url}
                className='aspect-square object-cover'
              />
            </div>
          ))}
        </div>
      </CardBody>      
    </>
  );
}