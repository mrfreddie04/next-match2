'use client';

import React, { useState } from 'react';  
import { Member } from "@prisma/client";
import { Card, CardFooter, Image } from '@nextui-org/react';
import Link from 'next/link';
import { calculateAge, transformImageUrl } from '@/lib/utils';
import LikeButton from '@/components/LikeButton';
import PresenceDot from '@/components/PresenceDot';
import { toggleLikeMember } from '../actions/likeActions';

type Props = {
  member: Member
  likeIds: string[]
}

export default function MemberCard( {member, likeIds}: Props) {
  const [loading, setLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(likeIds.includes(member.userId));

  const preventLinkAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }  
  
  const toggleLike = async () => {   
    try {
      setLoading(true);
      await toggleLikeMember(member.userId, hasLiked);
      setHasLiked( prev => !prev);
    } catch(e) {
      console.log(e)  
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      fullWidth className='relative' 
      as={Link} 
      href={`/members/${member.userId}`}
      isPressable
    >
      <Image 
        isZoomed
        alt={member.name}
        width={300}
        src={transformImageUrl(member.image) || '/images/user.png'}
        className='aspect-square object-cover'
      />
      <div onClick={preventLinkAction}>
        <div className='absolute top-3 right-3 z-50' >
          <LikeButton toggleLike={toggleLike} hasLiked={hasLiked} loading={loading}/>
        </div>
        <div className='absolute top-2 left-3 z-50' >
          <PresenceDot member={member}/>
        </div>        
      </div>
      <CardFooter className='absolute bottom-0 z-10 flex justify-start bg-black bg-dark-gradient overflow-hidden'>
        <div className='flex flex-col text-white'>
          <span className='font-semibold'>{member.name}, {calculateAge(member.dateOfBirth)}</span>
          <span className='text-sm'>{member.city}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
