'use client';

import React from 'react';
import { Image } from '@nextui-org/react';
import { CldImage } from "next-cloudinary";
import { Photo } from '@prisma/client';

type Props = {
  photo: Photo | null
}

export default function MemberImage({photo}: Props) {
  return (
    <div>
      {photo?.publicId ? (
        <CldImage
          alt='Image of member'          
          src={photo.publicId}
          width={300}
          height={300}
          crop='fill'
          gravity='faces'
          className='rounded-2xl'
          priority
        />
      ):(
        <Image 
          src={photo?.url || '/images/user.png'}
          width={300}
          height={300}
          alt='Image of memebr'
        />    
      )}
    </div>
  )
}  