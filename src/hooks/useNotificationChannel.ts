import { useCallback, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Channel } from "pusher-js";
import { EVENT_LIKE_NEW, EVENT_MESSAGE_NEW, pusherClient } from "@/lib/pusher";
import useMessageStore from "./useMessageStore";
import { LikeDto, MessageDto } from "@/types";
//import { newMessageToast } from "@/components/NewMessageToast";
import { newLikeToast, newMessageToast } from "@/components/NotificationToast";

export const useNotificationChannel = (userId: string | null) => {
  
  const { add, updateUnreadCount } = useMessageStore( state => ({
    add: state.add,
    updateUnreadCount: state.updateUnreadCount
  })); 

  //program defensively factoring in that in dev (strict mode) useEffect will be executed effectively twice
  //react stric mode want to test our cleanup function
  const channelRef = useRef<Channel | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const handleNewMessage = useCallback((message: MessageDto) => {
    //1) if the user is in chat component with this user - suppress notifications 
    //2) if the user is in inbox - add the message to MessageStore
    //3) otherwise - display a toast
    const container = searchParams.get("container") || "inbox";
    if(pathname === '/messages' && container !== 'outbox') {
      add(message);
    }
    else if(pathname !== `/members/${message.senderId}/chat`) {
      newMessageToast(message);
      //toast.info(`New message from: ${message.senderName}`);
    }

    //if a new message is received & the chat with the sender is not open then increment unread count
    if(message.recipientId === userId && pathname !== `/members/${message.senderId}/chat`) {
      updateUnreadCount(1);
    }

  },[add, pathname, searchParams, updateUnreadCount]);

  const handleNewLike = useCallback((like: LikeDto) => {
    console.log("NEW LIKE", like.userId)
    newLikeToast(like);
  },[]);  

  const channelName = `private-${userId}`;
  
  useEffect(() => {
    //console.log("UNC", userId)
    if(!userId) return; //set up subscription only for authorized users

    if(!channelRef.current) {
      channelRef.current = pusherClient.subscribe(channelName);   
      channelRef.current.bind(EVENT_MESSAGE_NEW, handleNewMessage);        
      channelRef.current.bind(EVENT_LIKE_NEW, handleNewLike);   
    }

    return () => {
      if(channelRef.current && channelRef.current.subscribed) {      
        channelRef.current.unbind(EVENT_MESSAGE_NEW, handleNewMessage);    
        channelRef.current.unbind(EVENT_LIKE_NEW, handleNewLike);       
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }  
    };
  }, [userId, handleNewMessage]);
}

