'use client';

import React, { Key, useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Avatar, Button, Card, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@nextui-org/react';
import { MessageDto } from '@/types';
import { AiFillDelete } from 'react-icons/ai';
import { deleteMessage } from '../actions/messageActions';
import { toast } from 'react-toastify';
import { delay, truncateString } from '@/lib/utils';

type Props = {
  messages: MessageDto[]
}

type Deleting = {
  deleting: boolean,
  id: string
}

export default function MessageTable({messages}: Props) {
  const [isDeleting, setIsDeleting] = useState<Deleting>({
    deleting: false,
    id: ''
  });  
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOutbox = searchParams.get("container") === "outbox";

  const columns = [
    { key: isOutbox ? 'recipientName' : 'senderName', label: isOutbox ? 'Recipient' : 'Sender'},
    { key: 'text', label: 'Message'},
    { key: 'createdAt', label: isOutbox ? 'Date sent' : 'Date received'},
    { key: 'actions', label: 'Action'}
  ];

  const handleMessageDelete = useCallback(async (message: MessageDto) => {
    //const handleMessageDelete = async (message: MessageDto) => {
    setIsDeleting({deleting: true,id: message.id});
    try {
      await deleteMessage(message.id, isOutbox);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting({ deleting: false, id: '' })
    }   
  },[isOutbox]);

  // const list = columns.map( col => col.key)
  // type Keys = typeof list[number]; // 'a'|'b'|'c';
  const handleRowSelect = (key:Key) => {
    const message = messages.find( message => message.id === key);
    if(!message) return;
    const userId = isOutbox ? message.recipientId : message.senderId;
    if(!userId) return;
    router.push(`/members/${userId}/chat`);
  }

  const renderCell = useCallback((item: MessageDto, columnKey: keyof MessageDto) => {
  //const renderCell = (item: MessageDto, columnKey: keyof MessageDto) => {
    //console.log("RC",isDeleting, item.id);
    const cellValue = item[columnKey];
    switch (columnKey) {
      case 'recipientName':
      case 'senderName':
        return (
          <div className='flex items-center gap-2 cursor-pointer'>
            <Avatar
              alt='Image of member'
              size='sm'
              src={(isOutbox ? item.recipientImage : item.senderImage) || "/images/user.png"} 
            />
            <span>{cellValue}</span>
          </div>
        )
      case 'text':  
        return (
          <div className='truncate'>
            {truncateString(cellValue,80)}
          </div>
        )
      case 'createdAt':      
        return cellValue;   
      default:  
        //for actions  
        //if(isDeleting.deleting) console.log("CV",isDeleting,item.id);
        return (          
          <Button 
            isIconOnly variant='light' 
            isLoading={isDeleting.deleting && isDeleting.id === item.id}
            onClick={() => handleMessageDelete(item)} 
          >
            <AiFillDelete size={24} className='text-danger'/>
          </Button>
        )
    }
  }, [isOutbox, isDeleting.id, isDeleting.deleting, handleMessageDelete]);
  
  //console.log("MT",isDeleting);

  return (
    <Card className='flex flex-col gap-3 h-[80vh] overflow-auto'>  
      <Table 
        aria-label='Table with messages'
        selectionMode='single'
        onRowAction={handleRowSelect}
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
                  {renderCell(item, columnKey as keyof MessageDto)}
                </TableCell>
              )}
            </TableRow>    
          )}
        </TableBody>  
      </Table>  
    </Card>
  )
} 