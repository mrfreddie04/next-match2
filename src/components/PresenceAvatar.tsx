'use client';

import React from 'react';
import { Avatar, Badge } from '@nextui-org/react';
import usePresenceStore from '@/hooks/usePresenceStore';

type Props = {
  userId?: string;
  src?: string | null;
  [key: string]: any;
}

export default function PresenceAvatar({ userId, src, ...props}: Props) {
  const { members } = usePresenceStore( state => ({
    members: state.members
  }));
  const isOnline = userId && members.includes( userId );
    
  return (
    <Badge {...props} content='' color='success' shape='circle' isInvisible={!isOnline}>
      <Avatar
        alt='User Avatar'
        size='sm'
        src={src || "/images/user.png"} 
      />    
    </Badge>
  )
}  