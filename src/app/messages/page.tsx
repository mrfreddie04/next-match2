import React from 'react'
import MessageSidebar from './MessageSidebar'
import { MessageContainer } from "@/types";
import { getMessagesByContainer } from '../actions/messageActions';
import MessageTable from './MessageTable';

type Props = {
  searchParams: {
    container: MessageContainer
    //[key: string]: string | string[] | undefined
  }
}

export default async function MessagesPage({searchParams}: Props) {
  const container = searchParams?.container || "inbox";
  const messages = await getMessagesByContainer(container);

  //console.log(messages);

  return (
    <div className="grid grid-cols-12 gap-5 h-[80vh] mt-10 mx-6">
      <div className="col-span-2">
        <MessageSidebar />
      </div>
      <div className="col-span-10">
        <MessageTable initialMessages={messages}/>
      </div>
    </div>
  )
}
