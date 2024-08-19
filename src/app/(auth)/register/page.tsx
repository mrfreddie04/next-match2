import React from 'react';
import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    // <CardWrapper
    //   body={<RegisterForm/>}
    //   headerIcon={GiPadlock}
    //   headerText='Register'
    //   subHeaderText='Welcome to NextMatch'
    // />
    <div className='flex items-center justify-center align-middle vertical-center'>
      <RegisterForm/>
    </div> 
  )
}
