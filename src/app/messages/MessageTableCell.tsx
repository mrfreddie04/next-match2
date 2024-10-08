'use client';

import { Button, ButtonProps, useDisclosure } from "@nextui-org/react";
import { AiFillDelete } from "react-icons/ai";
import { MessageDto } from "@/types";
import PresenceAvatar from "@/components/PresenceAvatar";
import { truncateString } from "@/lib/utils";
import AppModal from "@/components/AppModal";

type Props = {
  item: MessageDto;
  columnKey: keyof MessageDto;
  isOutbox: boolean;
  isDeleting: boolean;
  deleteMessage: (message: MessageDto) => Promise<void>//MouseEventHandler<HTMLButtonElement>
}

export default function MessageTableCell({item, columnKey, isOutbox, isDeleting, deleteMessage}: Props) {  
  const cellValue = item[columnKey];
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onConfirmDeleteMessage = async () => {
    await deleteMessage(item);
    onClose();
  }

  const footerButtons: ButtonProps[] = [
    {color: 'default', onClick: onClose, children: 'Cancel'},
    {color: 'secondary', onClick: onConfirmDeleteMessage, children: 'Confirm'},
  ];


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
      return <div>{cellValue}</div>;   
    default:  
      //for actions  
      //if(isDeleting.deleting) 
      //console.log("Render Button",isDeleting,item.id);
      return (    
        <>
          <Button 
            isIconOnly variant='light' 
            isLoading={isDeleting}
            onClick={onOpen} 
          >
            <AiFillDelete size={24} className='text-danger'/>
          </Button>
          <AppModal
            isOpen={isOpen}
            onClose={onClose}
            header='Please confirm this action'
            body={<div>Are you sure you want to delete this message? This cannot be undone.</div>}
            footerButtons={footerButtons}
          />
        </>      
      )
    }

}  

//            onClick={() => deleteMessage(item)} 