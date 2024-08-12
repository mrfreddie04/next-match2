'use client';

import { useEffect, useState } from 'react';
import { MessageDto } from '@/types';
import MessageBox from './MessageBox';
import { createChatId } from '@/lib/utils';
import { MESSAGE_NEW, pusherClient } from '@/lib/pusher';

type Props = {
  initialMessages: MessageDto[],
  currentUserId: string,
  chatId: string
}	

export default function MessageList({initialMessages, currentUserId, chatId}: Props) {  
  const [messages, setMessage] = useState<MessageDto[]>(initialMessages);

  useEffect(() => {
    console.log("CHATID",chatId, messages.length)
    //subscribe to the channel
    const channel = pusherClient.subscribe(chatId);
    channel.bind(MESSAGE_NEW, handleNewMessage);

    return () => {
      channel.unsubscribe();
      channel.unbind(MESSAGE_NEW);
    }  
  },[chatId]);

  const handleNewMessage = () =>  {

  }

  return (
    <div>
      {messages.length === 0 ? 'No messages to display':(
        <div>
          {messages.map(message => (
            <MessageBox key={message.id} message={message} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </div>
  )
} 