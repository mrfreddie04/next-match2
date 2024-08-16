'use client';

import React from 'react';
import { Button, Card, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@nextui-org/react';
import { MessageDto } from '@/types';
import { useMessages } from '@/hooks/useMessages';
import MessageTableCell from './MessageTableCell';

type Props = {
  initialMessages: MessageDto[],
  nextCursor?: string
}

export default function MessageTable({initialMessages, nextCursor}: Props) {
  const { 
    deleteMessage, selectRow, columns, isDeleting, isOutbox, messages,
    isLoadingMore, hasMore, loadMore,
  } = useMessages(initialMessages, nextCursor);

  return (
    <div className='flex flex-col h-[80vh]'>
      <Card>  
        <Table 
          className='flex flex-col gap-3 h-[80vh] overflow-auto'
          aria-label='Table with messages'
          selectionMode='single'
          onRowAction={selectRow}
          shadow='none'
        >
          <TableHeader columns={columns}>
            {(column) => (<TableColumn key={column.key} width={column.key === 'text' ? '50%' : undefined }>
              {column.label}
            </TableColumn>)}
          </TableHeader>
          <TableBody items={messages} emptyContent='No messages for this container'>
            {(item) => (
              <TableRow key={item.id} className='cursor-pointer'>
                {(columnKey) => (
                  <TableCell key={columnKey} className={`${!item.dateRead && !isOutbox ? 'font-semibold' : ''}`}>
                    {/* <div className={`${!item.dateRead && !isOutbox ? 'font-semibold' : ''}`}>
                      {getKeyValue(item,columnKey)}
                    </div> */}
                    <MessageTableCell 
                      item={item}
                      columnKey={columnKey as keyof MessageDto}
                      isOutbox={isOutbox}
                      isDeleting={isDeleting.deleting && isDeleting.id === item.id}
                      deleteMessage={deleteMessage}
                    />
                  </TableCell>
                )}
              </TableRow>    
            )}
          </TableBody>  
        </Table>  
        <div className='sticky bottom-0 pb-3 mr-3 text-right'>
          <Button 
            color='secondary'
            isDisabled={!hasMore} 
            isLoading={isLoadingMore} 
            onClick={loadMore}
          >
            {hasMore ? 'Load More' : 'No more messages'}
          </Button>
        </div>
      </Card>
    </div>
  )
} 
