'use client';

import React from 'react';
import { Button, Image, divider, useDisclosure } from '@nextui-org/react';
import { Photo, Role } from '@prisma/client';
import { CldImage } from "next-cloudinary";
import { useRole } from '@/hooks/useRole';
import clsx from 'clsx';
import { ImCheckmark, ImCross } from 'react-icons/im';
import { useRouter } from 'next/navigation';
import { approvePhoto, rejectPhoto } from '@/app/actions/adminActions';
import { toast } from 'react-toastify';
import AppModal from './AppModal';

type Props = {
  photo: Photo | null
}

export default function MemberImage({photo}: Props) {
  const role = useRole();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const handleOpenModal = () => {
    onOpen();
  }

  const handleCloseModal = () => {
    setTimeout(onClose, 10);
  }

  return (
    <div className='relative cursor-pointer' onClick={handleOpenModal}>
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
          alt='Image of member'
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
      <AppModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        imageModal={true}
        body={
          <>
            {photo?.publicId ? (
              <CldImage
                alt='Image of member'          
                src={photo.publicId}
                width={750}
                height={750}
                className={clsx('rounded-2xl', {
                  'opacity-40': !photo?.isApproved && role !== Role.ADMIN
                })}
                priority
              />
            ):(
              <Image 
                src={photo?.url || '/images/user.png'}
                width={750}
                height={750}
                alt='Image of memebr'
              />    
            )}            
          </>
        }
        header='Please confirm this action'
      />
    </div>
  )
}  