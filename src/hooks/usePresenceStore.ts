import { create } from "zustand";
import { devtools } from "zustand/middleware";

type PresenceState = {
  members: string[]; //userId
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
}

const usePresenceStore = create<PresenceState>()(devtools((set) => ({
  members: [],
  add: (id) => set((state) => ({...state, members: [...state.members, id]})),
  remove: (id) => set((state) => ({...state, members: state.members.filter( member => member !== id)})),
  set: (ids) => set((state) => ({...state, members: ids})),
}),{name:'PresenceStoreDemo'}));

export default usePresenceStore;