'use client';

import { Button } from "@nextui-org/react";
import { AiFillDelete } from "react-icons/ai";
import { MessageDto } from "@/types";
import PresenceAvatar from "@/components/PresenceAvatar";
import { truncateString } from "@/lib/utils";

type Props = {
  item: MessageDto;
  columnKey: keyof MessageDto;
  isOutbox: boolean;
  isDeleting: boolean;
  deleteMessage: (message: MessageDto) => Promise<void>//MouseEventHandler<HTMLButtonElement>
}

export default function MessageTableCell({item, columnKey, isOutbox, isDeleting, deleteMessage}: Props) {
  
  const cellValue = item[columnKey];

  switch (columnKey) {
    case 'recipientName':
    case 'senderName':
      return (
        <div className='flex items-center gap-2 cursor-pointer'>
          <PresenceAvatar
            userId={isOutbox ? item.recipientId : item.senderId}
            src={isOutbox ? item.recipientImage : item.senderImage} 
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
      //if(isDeleting.deleting) 
      //console.log("Render Button",isDeleting,item.id);
      return (          
        <Button 
          isIconOnly variant='light' 
          isLoading={isDeleting}
          onClick={() => deleteMessage(item)} 
        >
          <AiFillDelete size={24} className='text-danger'/>
        </Button>
      )
    }

}  