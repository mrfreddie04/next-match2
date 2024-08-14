import React from 'react';
import Link from 'next/link';
import { Image } from '@nextui-org/react';   
import { toast } from 'react-toastify';
import { LikeDto, MessageDto } from '@/types';
import { transformImageUrl } from '@/lib/utils';

type Props = {   
  href: string,
  image?: string | null,
  title: string,
  subtitle?: string | null
}

export default function NotificationToast({href, image, title, subtitle}: Props) {
  return (
    <Link href={href} className='flex intes-center'>
      <div className='mr-2'>
        <Image 
          src={image && transformImageUrl(image) || '/images/user.png'}
          height={50}
          width={50}
          alt='Sender image'
        />
      </div>
      <div className='flex flex-grow flex-col justify-center'>
        <div className='font-semibold'>{title}</div>
        <div className='text-sm'>{subtitle || 'Click to view'}</div>
      </div>
    </Link>
  )
}

export const newMessageToast = (message: MessageDto) => {
  toast(<NotificationToast 
    href={`/members/${message.senderId}/chat`} 
    image={message.senderImage} 
    title={`${message.senderName} sent you a message`} 
  />);
}

export const newLikeToast = (like: LikeDto) => {
  toast(<NotificationToast 
    href={`/members/${like.userId}`} 
    image={like.image} 
    title={`You have been liked by ${like.name}`} 
    subtitle='Click here to view their profile'
  />);
}