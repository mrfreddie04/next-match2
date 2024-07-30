'use client';

import React from 'react';
import { registerSchema, RegisterSchema, RegisterFields} from "@/lib/schemas/registerSchema";
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import { GiPadlock } from 'react-icons/gi';
import { registerUser } from '@/app/actions/authActions';
import { ZodIssue } from 'zod';

export default function RegisterForm() {
  const { register, handleSubmit, setError, formState: {errors, isValid, isSubmitting} } = useForm<RegisterSchema>({
    //resolver: zodResolver(registerSchema),
    mode: "onTouched"
  });

  const onSubmit: SubmitHandler<RegisterSchema> = async (data) => {
    //console.log(data);
    const result = await registerUser(data);
    if(result.status === "success") {
      console.log("User registered successfully");
    }
    if(result.status === "error") {
      if(Array.isArray(result.error)) {
        result.error.forEach( (e: ZodIssue) => {
          const fieldName = e.path.join(".") as RegisterFields;
          setError(fieldName, {message: e.message});
        });
      } else if(typeof result.error === "string") {
        setError("root.serverError", {message:result.error});
      }
    }

  }

  return (
    <Card className='w-2/5 mx-auto'>
      <CardHeader className='flex flex-col items-center justify-center'>
        <div className='flex flex-col gap-2 items-center text-secondary'>
          <div className='flex flex-row gap-3 items-center'>
            <GiPadlock size={30} />
            <h1 className='text-3xl font-semibold'>Register</h1>
          </div>
          <p className='text-neutral-500'>Welcome to NextMatch</p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'> 
            <Input
              defaultValue=''
              label='Name'
              variant='bordered'
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              {...register('name')}
            />          
            <Input
              defaultValue=''
              label='Email'
              variant='bordered'
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              {...register('email')}
            />
            <Input
              defaultValue=''
              label='Password'
              variant='bordered'
              type="password"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              {...register('password')}
            />  
            {errors.root?.serverError && (
              <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
            )}      
            <Button type="submit" fullWidth color='secondary' 
              isDisabled={!isValid} 
              isLoading={isSubmitting}
            >
              Register
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
