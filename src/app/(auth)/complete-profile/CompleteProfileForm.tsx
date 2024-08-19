'use client';

import React, { useState } from 'react';
import { ProfileSchema, profileSchema} from "@/lib/schemas/registerSchema";
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { Button } from '@nextui-org/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiProfileLine } from 'react-icons/ri';
import { completeSocialLoginProfile } from '@/app/actions/authActions';
import { handleFormServerErrors } from '@/lib/utils';
import ProfileForm from '../register/ProfileForm';
import ResultMessage from '@/components/ResultMessage';
import CardWrapper from '@/components/CardWrapper';
import { ActionResult } from '@/types';
import { signIn } from 'next-auth/react';


export default function CompleteProfileForm() {
  const [result, setResult] = useState<ActionResult<string> | null>(null);
  //const router = useRouter();

  //validate active step schema
  const methods = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched"
  });

  const { handleSubmit, setError, formState: {errors, isValid, isSubmitting }} = methods;

  const onSubmit: SubmitHandler<ProfileSchema>  = async (data) => {
    const result = await completeSocialLoginProfile(data);
    if(result.status === "success") {
      console.log("User profile created successfully");
      //get new token with updated payload ()
      signIn(result.data, {callbackUrl: '/members'}); 
    }
    else if(result.status === "error") {
      console.log("CompleteProfileError",result.error);
      handleFormServerErrors(result, setError);
    }
  }

  return (
    <CardWrapper 
      headerIcon={RiProfileLine}
      headerText='About you'
      subHeaderText='Please complete your profile to continue to the app'
      body={
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-4'> 
              < ProfileForm />
              {errors.root?.serverError && (
                <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
              )}  
              <div className='flex flex-row items-center gap-6'>
                <Button 
                  type='submit' 
                  isDisabled={!isValid} 
                  isLoading={isSubmitting}  
                  color='secondary'                  
                  fullWidth
                >
                  Submit
                </Button>
              </div>    
            </div>
          </form>
        </FormProvider>        
      }
      footer={<ResultMessage result={result}/>}
    />
  )
}
