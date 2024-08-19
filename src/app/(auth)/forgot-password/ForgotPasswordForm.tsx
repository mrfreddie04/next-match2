'use client';

import React, { useState } from 'react'
import { Button, Input } from '@nextui-org/react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GiPadlock } from 'react-icons/gi'
import { generateResetPasswordEmail } from '@/app/actions/authActions';
import { ForgotPasswordSchema, forgotPasswordSchema } from '@/lib/schemas/forgotPasswordSchema';
import CardWrapper from '@/components/CardWrapper';
import { ActionResult } from '@/types';
import ResultMessage from '@/components/ResultMessage';

export default function ForgotPasswordForm() {
  const [result, setResult] = useState<ActionResult<string> | null>(null);
  const { register, handleSubmit, reset, 
    formState: {errors, isValid, isSubmitting} } = useForm<ForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onTouched"
    });

  const onSubmit: SubmitHandler<ForgotPasswordSchema> = async (data) => {
    const result = await generateResetPasswordEmail(data.email);
    setResult(result);
    reset();
  }

  return (
    <CardWrapper 
      headerIcon={GiPadlock}
      headerText='Forgot password'
      subHeaderText='Please enter your email address and we will send you a link to reset your password'
      body={
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
          <Input
            defaultValue=''
            placeholder='Email address'
            variant='bordered'
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            {...register('email')}
          />            
          <Button type="submit" fullWidth 
            color='secondary' 
            isDisabled={!isValid} 
            isLoading={isSubmitting}
          >
            Send reset email
          </Button>
        </form>
      }
      footer={<ResultMessage result={result}/>}
    />
  )
}

//{...register('email', {required: true})}
