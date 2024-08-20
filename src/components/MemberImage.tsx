'use client';

import React from 'react';
import { Button, Image, divider } from '@nextui-org/react';
import { Photo, Role } from '@prisma/client';
import { CldImage } from "next-cloudinary";
import { useRole } from '@/hooks/useRole';
import clsx from 'clsx';
import { ImCheckmark, ImCross } from 'react-icons/im';
import { useRouter } from 'next/navigation';
import { approvePhoto, rejectPhoto } from '@/app/actions/adminActions';
import { toast } from 'react-toastify';

type Props = {
  photo: Photo | null
}

export default function MemberImage({photo}: Props) {
  const role = useRole();
  const router = useRouter();

  if(!photo) {
    return null;
  }

  const handleApprove = async () => {
    try {
      await approvePhoto(photo.id);
      router.refresh();
    } catch(e: any) {
      toast.error(e.message);      
    }
  }

  const handleReject = async () => {
    try {
      await rejectPhoto(photo);
      router.refresh();
    } catch(e: any) {
      toast.error(e.message);      
    }
  }

  return (
    <div className='relative'>
      {photo?.publicId ? (
        <CldImage
          alt='Image of member'          
          src={photo.publicId}
          width={300}
          height={300}
          crop='fill'
          gravity='faces'
          className={clsx('rounded-2xl', {
            'opacity-40': !photo?.isApproved && role !== Role.ADMIN
          })}
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
      {!photo?.isApproved && role !== Role.ADMIN && (
        <div className='absolute bottom-2 w-full z-50 bg-slate-200 p-1'>
          <div className='flex justify-center text-danger font-semibold'>
            Awaiting approval
          </div>
        </div>
      )}
      { role === Role.ADMIN && (
        <div className='flex flex-row gap-2 mt-2'>
          <Button color='success' variant='bordered' fullWidth onClick={handleApprove}>
            <ImCheckmark size={20}/>
          </Button>
          <Button color='danger' variant='bordered' fullWidth onClick={handleReject}>
            <ImCross size={20}/>
          </Button>          
        </div>
      )}
    </div>
  )
}  