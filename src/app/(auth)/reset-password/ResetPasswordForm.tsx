'use client';

import React, { useState } from 'react'
import { Button, Input } from '@nextui-org/react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GiPadlock } from 'react-icons/gi'
import { generateResetPasswordEmail, resetPassword } from '@/app/actions/authActions';
import CardWrapper from '@/components/CardWrapper';
import { ActionResult } from '@/types';
import ResultMessage from '@/components/ResultMessage';
import { ResetPasswordSchema, resetPasswordSchema } from '@/lib/schemas/resetPasswordSchema';
import { useSearchParams } from 'next/navigation';


export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<ActionResult<string> | null>(null);
  const { register, handleSubmit, reset, 
    formState: {errors, isValid, isSubmitting} } = useForm<ResetPasswordSchema>({
      resolver: zodResolver(resetPasswordSchema),
      mode: "onTouched"
    });

  const onSubmit: SubmitHandler<ResetPasswordSchema> = async (data) => {
    const resetResult = await resetPassword(data.password, searchParams.get("token"));
    setResult(resetResult);
    reset();
  }

  return (
    <CardWrapper 
      headerIcon={GiPadlock}
      headerText='Reset password'
      subHeaderText='Enter your new password below'
      body={
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
          <Input
            defaultValue=''
            label='Password'
            variant='bordered'
            type="password"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            {...register('password')}
          />       
          <Input
            defaultValue=''
            label='Confirm Password'
            variant='bordered'
            type="password"
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />              
          <Button type="submit" fullWidth 
            color='secondary' 
            isDisabled={!isValid} 
            isLoading={isSubmitting}
          >
            Reset password
          </Button>
        </form>
      }
      footer={<ResultMessage result={result}/>}
    />
  )
}