import { Key, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { MessageContainer, MessageDto } from "@/types";
import { deleteMessage, getMessagesByContainer } from "@/app/actions/messageActions";
import { toast } from "react-toastify";
import useMessageStore from "./useMessageStore";

type Deleting = {
  deleting: boolean,
  id: string
}

//nextCursor comes from the original load of the first page
export const useMessages = (initialMessages: MessageDto[], nextCursor?: string) => {
  const cursorRef = useRef<string | undefined>(nextCursor); //updated after each loading of subsequent chunk of messages
  
  const { set, resetMessages, remove, messages, updateUnreadCount } = useMessageStore( state => ({
    set: state.set,
    resetMessages: state.resetMessages,
    remove: state.remove,
    messages: state.messages,
    updateUnreadCount: state.updateUnreadCount
  }));

  const [isDeleting, setIsDeleting] = useState<Deleting>({deleting: false, id: ''});  
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const isOutbox = searchParams.get("container") === "outbox";
  const container = (searchParams.get("container") || "inbox") as MessageContainer;

  useEffect(() => {
    //console.log("SET MESSAGES");
    set(initialMessages);
    cursorRef.current = nextCursor;

    return () => {
      resetMessages();
      cursorRef.current = undefined;
    }
  },[initialMessages, set, resetMessages, nextCursor]);

  const columns = [
    { key: isOutbox ? 'recipientName' : 'senderName', label: isOutbox ? 'Recipient' : 'Sender'},
    { key: 'text', label: 'Message'},
    { key: 'createdAt', label: isOutbox ? 'Date sent' : 'Date received'},
    { key: 'actions', label: 'Action'}
  ];

  const handleMessageLoadMore = useCallback(async () => {
    if(cursorRef.current) {
      setIsLoadingMore(true);
      const { messages, nextCursor } = await getMessagesByContainer(container, cursorRef.current);
      set(messages); //append to the store
      cursorRef.current = nextCursor; //update the cursor
      setIsLoadingMore(false);
    }
  },[container, set]);

  const handleMessageDelete = useCallback(async (message: MessageDto) => {
    //const handleMessageDelete = async (message: MessageDto) => {
    //console.log("HD",message.id)
    setIsDeleting({deleting: true,id: message.id});
    try {
      await deleteMessage(message.id, isOutbox);
      remove(message.id);
      if(!message.dateRead && !isOutbox) updateUnreadCount(-1);
      //router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting({ deleting: false, id: '' });
    }   
  },[isOutbox, remove, updateUnreadCount]);

  // const list = columns.map( col => col.key)
  // type Keys = typeof list[number]; // 'a'|'b'|'c';
  const handleRowSelect = (key:Key) => {
    const message = messages.find( message => message.id === key);
    if(!message) return;
    const userId = isOutbox ? message.recipientId : message.senderId;
    if(!userId) return;
    router.push(`/members/${userId}/chat`);
  }

  return { 
    deleteMessage: handleMessageDelete,
    loadMore: handleMessageLoadMore, 
    selectRow: handleRowSelect, 
    columns, 
    isDeleting, 
    isLoadingMore,
    hasMore: !!cursorRef.current,
    isOutbox,
    messages 
  }
}

