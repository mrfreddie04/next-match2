'use client';

import React from 'react'
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react'
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { GiPadlock } from 'react-icons/gi'
import { toast } from 'react-toastify';
import { LoginSchema, loginSchema } from '@/lib/schemas/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInUser } from '@/app/actions/authActions';

type IFormInput = {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { register, handleSubmit, formState: {errors, isValid, isSubmitting} } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched"
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    //console.log(data);
    const result = await signInUser(data);
    if(result.status === "success") {
      toast.success(result.data);
      router.push("/members");
      router.refresh(); //refreshes the current page
    } else if(result.status === "error") {
      //console.log(result.error);
      toast.error(result.error as string);
      //setError("root.serverError", {message: result.error as string});
    }    
  }

  return (
    <Card className='w-2/5 mx-auto'>
      <CardHeader className='flex flex-col items-center justify-center'>
        <div className='flex flex-col gap-2 items-center text-secondary'>
          <div className='flex flex-row gap-3 items-center'>
            <GiPadlock size={30} />
            <h1 className='text-3xl font-semibold'>Login</h1>
          </div>
          <p className='text-neutral-500'>Welcome back to NextMatch</p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'> 
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
            {/* {errors.root?.serverError && (
              <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
            )}                      */}
            <Button type="submit" fullWidth color='secondary' 
              isDisabled={!isValid} 
              isLoading={isSubmitting}
            >
              Login
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
