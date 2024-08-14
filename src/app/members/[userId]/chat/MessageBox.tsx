'use client';

import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Avatar } from '@nextui-org/react';
import { MessageDto } from "@/types";
import { timeAgo, transformImageUrl } from '@/lib/utils';
import PresenceAvatar from '@/components/PresenceAvatar';

type Props = {
  message: MessageDto;
  currentUserId: string;
}

export default function MessageBox({message, currentUserId}: Props) {  
  const isCurrentUserSender = currentUserId === message.senderId;
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if(messageEndRef.current) {
      messageEndRef.current.scrollIntoView({behavior: 'smooth'});
    }
  },[messageEndRef]);
  
  const renderAvatar = () => (
    // <Avatar 
    //   name={message.senderName}
    //   className='self-end'
    //   size='sm'
    //   src={transformImageUrl(message.senderImage) || "/images/user.png"}      
    // />
    <PresenceAvatar 
      userId={message.senderId}
      src={transformImageUrl(message.senderImage)}
      className='self-end'        
    />
  );

  const messageContentClasses = clsx(
    'flex flex-col w-[50%] px-2 py-1',
    {'rounded-l-xl rounded-tr-xl text-white bg-blue-100': isCurrentUserSender},
    {'rounded-r-xl rounded-tl-xl border-gray-200 bg-green-100': !isCurrentUserSender}
  );

  const renderMessageHeader = () => (
    <div className={clsx('flex items-center w-full',
      {'justify-between': isCurrentUserSender && message.dateRead},
      {'justify-end': isCurrentUserSender && !message.dateRead} 
    )}>
      {message.dateRead && message.recipientId !== currentUserId && (
        <span className='text-xs text-black text-italic'>({timeAgo(message.dateRead)} ago)</span>
      )} 
      <div className={clsx('flex')}>
        <span className='text-sm font-semibold text-gray-900'>{message.senderName}</span>
        <span className='text-sm font-semibold text-gray-500 ml-2'>{message.createdAt}</span>
      </div>
    </div>
  );

  const renderMessageContent = () => (
    <div className={messageContentClasses}>
      {renderMessageHeader()}
      <p className='text-sm py-3 text-gray-900'>{message.text}</p>      
    </div>
  )

  return (
    <div className='grid grid-rows-1 bg-n'>
      <div className={clsx('flex gap-2 mb-3', {
        'justify-end text-right': isCurrentUserSender,
        'justify-start': !isCurrentUserSender
      })}>
        {!isCurrentUserSender && renderAvatar()}
        {renderMessageContent()}
        {isCurrentUserSender && renderAvatar()}
      </div>
      <div ref={messageEndRef}/>
    </div>
  )
}  