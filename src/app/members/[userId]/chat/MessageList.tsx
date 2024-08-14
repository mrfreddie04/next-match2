'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageDto } from '@/types';
import MessageBox from './MessageBox';
import { createChatId, formatShortDateTime } from '@/lib/utils';
import { EVENT_MESSAGES_READ, EVENT_MESSAGE_NEW, pusherClient } from '@/lib/pusher';
import { Channel } from 'pusher-js';
import useMessageStore from '@/hooks/useMessageStore';

type Props = {
  initialMessages: { messages: MessageDto[], readCount: number }
  currentUserId: string,
  chatId: string
}	

export default function MessageList({initialMessages, currentUserId, chatId}: Props) { 
  const setReadCount = useRef<boolean>(false);
  const { updateUnreadCount } = useMessageStore( state => ({
    updateUnreadCount: state.updateUnreadCount
  }));     

  const [messages, setMessages] = useState<MessageDto[]>(initialMessages.messages);
  const channelRef = useRef<Channel | null>(null);

  const handleNewMessage = useCallback((message: MessageDto) => {
    setMessages(prevState => [...prevState, message]);
  },[]);

  const handleReadMessages = useCallback((messageIds: string[]) => {
    setMessages(prevState => prevState.map( message => (
      {...message, dateRead: messageIds.includes(message.id) ? formatShortDateTime(new Date()) : message.dateRead }
    )));
  },[]);

  //messages.includes(message.id) ? new Date() : new Date()
  useEffect(() => {
    if(!setReadCount.current) {
      updateUnreadCount(-initialMessages.readCount)
      setReadCount.current = true;
    }
  },[updateUnreadCount, initialMessages.readCount]);

  useEffect(() => {
    //console.log("CHATID",chatId, messages.length)
    //subscribe to the channel
    //if(!channelRef.current) 
    //console.log("useEffect", !!channelRef.current);
    if(channelRef.current) return;

    channelRef.current = pusherClient.subscribe(chatId);
    channelRef.current.bind(EVENT_MESSAGE_NEW, handleNewMessage);
    channelRef.current.bind(EVENT_MESSAGES_READ, handleReadMessages);

    //console.log("BOUND", chatId, MESSAGE_NEW)

    return () => {
      if(channelRef.current && channelRef.current.subscribed) {
        channelRef.current.unbind(EVENT_MESSAGE_NEW, handleNewMessage);
        channelRef.current.unbind(EVENT_MESSAGES_READ, handleReadMessages);
        channelRef.current.unsubscribe();
      }
      //console.log("UNBOUND", chatId, MESSAGE_NEW)
    }  
  },[chatId, handleNewMessage, handleReadMessages]);

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