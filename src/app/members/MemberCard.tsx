import React from 'react';
import { Member } from "@prisma/client";
import { Card, CardFooter, Image } from '@nextui-org/react';
import Link from 'next/link';
import { calculateAge } from '@/lib/utils';

type Props = {
  member: Member
}

export default function MemberCard( {member}: Props) {
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
        src={member.image || '/images/user.png'}
        className='aspect-square object-cover'
      />
      <CardFooter className='absolute bottom-0 z-10 flex justify-start bg-dark-gradient overflow-hidden'>
        <div className='flex flex-col text-white'>
          <span className='font-semibold'>{member.name}, {calculateAge(member.dateOfBirth)}</span>
          <span className='text-sm'>{member.city}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
