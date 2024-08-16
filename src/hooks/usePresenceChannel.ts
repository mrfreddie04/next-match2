import { useCallback, useEffect, useRef } from "react";
import { Channel, Members } from "pusher-js";
import { pusherClient, CHANNEL_PRESENCE_NM, 
  EVENT_PRESENCE_SUBSCRIPTION_SUCCEEDED, 
  EVENT_PRESENCE_MEMBER_ADDED,
  EVENT_PRESENCE_MEMBER_REMOVED 
} from "@/lib/pusher";
import usePresenceStore from "./usePresenceStore";
import { updateLastActive } from "@/app/actions/memberActions";

export const usePresenceChannel = (userId: string | null) => {
  // usePresenceStore is overloaded:
  // 1) no params - returns the entire PresenceState
  // 2) can pass a function that takes PresenceState as a pram and returns the "public interface" to the store
  const { set, add, remove } = usePresenceStore( state => ({
    set: state.set,
    add: state.add,
    remove: state.remove
  }));

  //program defensively factoring in that in dev (strict mode) useEffect will be executed effectively twice
  //react stric mode want to test our cleanup function
  const channelRef = useRef<Channel | null>(null);

  const handleSetMembers = useCallback((members: Members)=> {
    const memberIds = Object.keys(members.members);
    set(memberIds);
  },[set]);

  const handleSusbscriptionSucceeded = useCallback(async (members: Members)=> {
    handleSetMembers(members);
    await updateLastActive();
  },[handleSetMembers]);

  const handleAddMember = useCallback((member: Record<string,any>) => {
    const memberId = member.id;
    add(memberId);
  },[add]);
  
  const handleRemoveMember = useCallback((member: Record<string,any>) => {
    const memberId = member.id;
    remove(memberId);
  },[remove]);  

  useEffect(() => {
    if(!userId) return;
    
    if(!channelRef.current) {
      channelRef.current = pusherClient.subscribe(CHANNEL_PRESENCE_NM);      
      channelRef.current.bind(EVENT_PRESENCE_SUBSCRIPTION_SUCCEEDED, handleSusbscriptionSucceeded);
      channelRef.current.bind(EVENT_PRESENCE_MEMBER_ADDED, handleAddMember);     
      channelRef.current.bind(EVENT_PRESENCE_MEMBER_REMOVED, handleRemoveMember);        
    }

    return () => {
      if(channelRef.current && channelRef.current.subscribed) {      
        channelRef.current.unbind(EVENT_PRESENCE_SUBSCRIPTION_SUCCEEDED, handleSusbscriptionSucceeded);
        channelRef.current.unbind(EVENT_PRESENCE_MEMBER_ADDED, handleAddMember);     
        channelRef.current.unbind(EVENT_PRESENCE_MEMBER_REMOVED, handleRemoveMember);   
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }  
    };
  }, [handleSetMembers, handleAddMember, handleRemoveMember, handleSusbscriptionSucceeded, userId]);
}

/*
  const handleSetMembers = useCallback((memberIds: string[]) => {
    set(memberIds);
  },[set]);

  const handleAddMember = useCallback((memberId: string) => {
    add(memberId);
  },[add]);
  
  const handleRemoveMember = useCallback((memberId: string) => {
    remove(memberId);
  },[remove]);  

  channelRef.current.bind(EVENT_PRESENCE_SUBSCRIPTION_SUCCEEDED, (members: Members) => {
    handleSetMembers(Object.keys(members.members));
  });

  channelRef.current.bind(EVENT_PRESENCE_MEMBER_ADDED, (member: Record<string,any>) => {
    handleAddMember(member.id);
  });     
  
  channelRef.current.bind(EVENT_PRESENCE_MEMBER_REMOVED, (member: Record<string,any>) => {
    handleRemoveMember(member.id);
  });   
*/