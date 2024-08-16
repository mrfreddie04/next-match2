import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { MessageDto } from "@/types";

type MessageState = {
  messages: MessageDto[]; 
  unreadCount: number;
  add: (message: MessageDto) => void;
  remove: (id: string) => void;
  set: (messages: MessageDto[]) => void;
  updateUnreadCount: (quantity: number) => void;
  resetMessages: () => void;
}

//add new messages to the front of the array - we display newest first
const useMessageStore = create<MessageState>()(devtools((set) => ({
  messages: [],
  unreadCount: 0,
  add: (message) => set((state) => ({...state, messages: [{...message}, ...state.messages]})),
  remove: (id) => set((state) => ({...state, messages: state.messages.filter(msg => msg.id !== id )})),
  updateUnreadCount: (quantity) => set((state)=>({...state, unreadCount: state.unreadCount + quantity})),
  resetMessages: () => set((state) => ({...state, messages: []})),
  set: (messages) => set((state) => { 
    const map = new Map([...state.messages,...messages].map( m => [m.id,m]));
    const uniqueMessages = Array.from(map.values());
    return {...state, messages: uniqueMessages};
  }),
}),{name:'MessageStoreDemo'}));

export default useMessageStore;