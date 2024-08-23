'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';
import CardWrapper from '@/components/CardWrapper';

export default function RegisterSuccessPage() {
  const router = useRouter();
  return (
    <CardWrapper
      headerIcon={FaCheckCircle}
      headerText='You have successfully registered'
      subHeaderText='Please verify your email address before you can login'
      action={() => {router.push("/login")}}
      actionLabel='Go to Login'
    />
  )
}