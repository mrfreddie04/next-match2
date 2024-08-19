'use client';

import React from 'react';
import { RegisterSchema} from "@/lib/schemas/registerSchema";
import { useFormContext } from 'react-hook-form';
import { Input } from '@nextui-org/react';

export default function UserDetailsForm() {
  const { register, getValues, formState: {errors} } = useFormContext<RegisterSchema>();

  return(
    <div className="space-y-4">
      <Input
        defaultValue={getValues('name')}
        label='Name'
        variant='bordered'
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
        {...register('name')}
      />          
      <Input
        defaultValue={getValues('email')}
        label='Email'
        variant='bordered'
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        {...register('email')}
      />
      <Input
        defaultValue={getValues('password')}
        label='Password'
        variant='bordered'
        type="password"
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
        {...register('password')}
      />  
    </div>
  )
}