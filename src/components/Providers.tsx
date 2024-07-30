'use client';

import React from 'react';
import { NextUIProvider } from "@nextui-org/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
  children: React.ReactNode
}

export default function Providers({children}: Props) {
  return (
    <NextUIProvider>
      <ToastContainer position='bottom-right' className='z-50' hideProgressBar/>
      {children}
    </NextUIProvider>
  )
}
