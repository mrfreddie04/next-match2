'use client';

import React, { useEffect } from 'react';
import { Pagination } from '@nextui-org/react';
import clsx from 'clsx';
import usePaginationStore from '@/hooks/usePaginationStore';

type Props = {
  totalCount: number;
}

export default function PaginationComponent({totalCount}: Props) {

  const { pagination, setPage, setPageSize, setPagination } = usePaginationStore(state => ({
    pagination: state.pagination,
    setPage: state.setPage,
    setPageSize: state.setPageSize,
    setPagination: state.setPagination
  }));

  useEffect(() =>{
    setPagination(totalCount);
  },[setPagination, totalCount]);

  const { pageSize, pageNumber, totalPages} = pagination;

  const start = (pageNumber - 1) * pageSize + 1;
  const end = Math.min(pageNumber * pageSize, totalCount);
  const resultText = `Showing ${start}-${end} of ${totalCount} results`;

  return (
    <div className='border-t-2 w-full mt-5'>
      <div className='flex flex-row justify-between items-center py-5'>
        <div>{resultText}</div>
        <Pagination 
          total={totalPages}
          page={pageNumber}
          color='secondary'
          variant='bordered'
          onChange={setPage}
        />
        <div className='flex flex-row gap-1 items-center'>
          Page size:
          {[3,6,12].map(size => (
            <div 
              key={size} 
              onClick={()=>setPageSize(size)}
              className={clsx('page-size-box', {
                'bg-secondary text-white hover:bg-secondary hover:text-white': size === pageSize,
              })}
            >
              {size}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}