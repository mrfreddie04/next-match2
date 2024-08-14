'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { NextUIProvider } from "@nextui-org/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePresenceChannel } from '@/hooks/usePresenceChannel';
import { useNotificationChannel } from '@/hooks/useNotificationChannel';
import useMessageStore from '@/hooks/useMessageStore';
import { getUnreadMessageCount } from '@/app/actions/messageActions';

type Props = {
  userId: string | null;
  children: React.ReactNode
}

export default function Providers({children, userId}: Props) {
  const isUnreadCountSet = useRef<boolean>(false);
  const { updateUnreadCount } = useMessageStore( state => ({
    updateUnreadCount: state.updateUnreadCount
  }));   
  
  const setUnreadCount = useCallback((quantity: number) => {
    updateUnreadCount(quantity);
  },[updateUnreadCount]);

  useEffect(() => {
    if(!isUnreadCountSet.current && !!userId) {
      isUnreadCountSet.current = true;
      getUnreadMessageCount().then( count => {        
        setUnreadCount(count);
      });
    }
  },[setUnreadCount, isUnreadCountSet, userId]);

  usePresenceChannel(userId);
  useNotificationChannel(userId);

  return (
    <NextUIProvider>
      <ToastContainer position='bottom-right' className='z-50' hideProgressBar/>
      {children}
    </NextUIProvider>
  )
}
