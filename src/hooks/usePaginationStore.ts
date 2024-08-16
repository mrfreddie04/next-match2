import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PagingResult } from '@/types';

type PaginationState = {
  pagination: PagingResult;
  setPagination: (totalCount: number) => void; //set totalPages & totalCount - from response after filter update
  setPage: (pageNumber: number) => void; //set based on user input
  setPageSize: (pageSize: number) => void; //set based on user input
}

const usePaginationStore = create<PaginationState>()(devtools((set) => ({
  pagination: {
    pageSize: 12,
    pageNumber: 1,
    totalCount: 0,
    totalPages: 1
  },
  setPagination: (totalCount) => set((state) => ({...state, pagination: {
      ...state.pagination, 
      totalCount, 
      pageNumber: 1, //reset to the first page after chanign the filter
      totalPages: Math.ceil(totalCount / state.pagination.pageSize)
    }
  })),
  setPage: (pageNumber) => set((state) => ({...state, pagination: {...state.pagination, pageNumber}})),
  setPageSize: (pageSize) => set((state) => ({...state, pagination: {
      ...state.pagination, 
      pageSize, 
      pageNumber: 1,
      totalPages: Math.ceil(state.pagination.totalCount / pageSize)
    }
  })),
}),{name:'PaginationStoreDemo'}));

export default usePaginationStore;

// setPagination: (totalCount) => (
//   set((state) => { 
//     const totalPages = Math.ceil(totalCount / state.pagination.pageSize);
//     //reset to the first page
//     const pageNumber = 1; //Math.min(state.pagination.pageNumber, totalPages);
//     return {...state, pagination: {...state.pagination, 
//       totalCount, 
//       totalPages, 
//       pageNumber
//     }};
//   })
// ),