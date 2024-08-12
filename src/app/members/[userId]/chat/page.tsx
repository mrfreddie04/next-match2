import React from 'react';
import { getMessageThread } from '@/app/actions/messageActions';
import { getAuthUserId } from '@/app/actions/authActions';
import CardInnerWrapper from '@/components/CardInnerWrapper';
import ChatForm from './ChatForm';
import MessageList from './MessageList';
import { createChatId } from '@/lib/utils';

type Props = {
  params: {
    userId: string
  }
}	

export default async function MemberChatPage({params}: Props) {
  const currentUserId = await getAuthUserId();
  const messages = await getMessageThread(params.userId);
  const chatId = createChatId(currentUserId, params.userId);
  //console.log(messages);

  return (
    <CardInnerWrapper 
      header="Chat" 
      body={<MessageList initialMessages={messages} currentUserId={currentUserId} chatId={chatId}/>}
      footer={<ChatForm/>}
    />
  )  
}