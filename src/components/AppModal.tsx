'use client';

import React, { ReactNode } from 'react';
import { Button, ButtonProps, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  body: ReactNode;
  footerButtons?: ButtonProps[];
  imageModal?: boolean;
}

export default function AppModal({ isOpen, onClose, header, body, footerButtons, imageModal }: Props) {  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement='top-center'
      classNames={{
        base: `${imageModal ? 'border-2 border-white': ''}`,
        body: `${imageModal ? 'p-0': ''}`,
      }}
      motionProps={{ 
        variants: { 
          enter: {y:0, opacity:100, transition: {duration: 0.3}},
          exit: {y:100, opacity:0, transition: {duration: 0.3}},
        } 
      }}
    >
      <ModalContent>
        {!imageModal && header && (<ModalHeader className='flex flex-col gap-1'>{header}</ModalHeader>)}
        <ModalBody>{body}</ModalBody>
        {!imageModal && (<ModalFooter>
          {footerButtons && footerButtons.map( (props, index) => (
            <Button key={index} {...props}>
              {props.children}
            </Button>
          ))}
        </ModalFooter>)}
      </ModalContent>
    </Modal>
  )
}