'use client';

import React from 'react';
import { Card, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@nextui-org/react';
import { MessageDto } from '@/types';
import { useMessages } from '@/hooks/useMessages';
import MessageTableCell from './MessageTableCell';

type Props = {
  initialMessages: MessageDto[]
}

export default function MessageTable({initialMessages}: Props) {
  //console.log("Render Message Table",isDeleting);
  const { deleteMessage, selectRow, columns, isDeleting, isOutbox, messages } = useMessages(initialMessages);

  return (
    <Card className='flex flex-col gap-3 h-[80vh] overflow-auto'>  
      <Table 
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
    </Card>
  )
} 
