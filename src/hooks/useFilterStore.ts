import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UserFilters } from '@/types';

type FilterState = {
  filters: UserFilters,
  setFilters: (filterName: keyof UserFilters, value: any) => void;
}

const useFilterStore = create<FilterState>()(devtools((set) => ({
  filters: {
    ageRange: [18,100],
    gender: ['male','female'],
    orderBy: 'updatedAt',
    withPhoto: true
  },
  setFilters: (filterName, value) => set(
    (state) => ({...state, filters: {...state.filters, [filterName]: value}})
  ),
}),{name:'FilterStoreDemo'}));

export default useFilterStore;