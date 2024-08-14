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
}

//add new messages to the front of the array - we display newest first
const useMessageStore = create<MessageState>()(devtools((set) => ({
  messages: [],
  unreadCount: 0,
  add: (message) => set((state) => ({...state, messages: [{...message}, ...state.messages]})),
  remove: (id) => set((state) => ({...state, messages: state.messages.filter(msg => msg.id !== id )})),
  set: (messages) => set((state) => ({...state, messages: [...messages]})),
  updateUnreadCount: (quantity) => set((state)=>({...state, unreadCount: state.unreadCount + quantity}))
}),{name:'MessageStoreDemo'}));

export default useMessageStore;