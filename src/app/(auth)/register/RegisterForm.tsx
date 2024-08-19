'use client';

import React, { useState } from 'react';
import { userDetailsSchema, RegisterSchema, profileSchema} from "@/lib/schemas/registerSchema";
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { GiPadlock } from 'react-icons/gi';
import { registerUser } from '@/app/actions/authActions';
import { handleFormServerErrors } from '@/lib/utils';
import UserDetailsForm from './UserDetailsForm';
import ProfileForm from './ProfileForm';

//{ register, handleSubmit, setError, formState: {errors, isValid, isSubmitting} }
const stepSchemas = [userDetailsSchema, profileSchema];

export default function RegisterForm() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const currentValidationSchema = stepSchemas[activeStep];

  //validate active step schema
  const methods = useForm<RegisterSchema>({
    resolver: zodResolver(currentValidationSchema),
    mode: "onTouched"
  });

  const { getValues, handleSubmit, setError, formState: {errors, isValid, isSubmitting }} = methods;

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <UserDetailsForm />;
      case 1:
        return <ProfileForm />;
      default:
        return 'Unknown step';
    }
  }

  const onBack = () => {
    if(activeStep === 0) return;
    setActiveStep(prev => prev-1);
  }

  const onNext = async () => {
    if(activeStep === stepSchemas.length-1 ) return;
    setActiveStep(prev => prev+1);
    // if(activeStep === stepSchemas.length-1 ) {
    //   await onSubmit();
    // } else {
    //   setActiveStep(prev => prev+1);
    // }
  }  

  const onSubmit = async () => {
    if(activeStep !== stepSchemas.length-1 ) return;
    const data = getValues();

    const result = await registerUser(data);
    if(result.status === "success") {
      console.log("User registered successfully");
      //redirect
      router.push("/register/success");
    }
    else if(result.status === "error") {
      console.log("RegisterError",result.error);
      handleFormServerErrors(result, setError);
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
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-4'> 
              { getStepContent(activeStep) }
              {errors.root?.serverError && (
                <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
              )}  
              <div className='flex flex-row items-center gap-6'>
                {activeStep !== 0 && (
                  <Button onClick={onBack} fullWidth >
                    Back
                  </Button>
                )}
                {activeStep !== stepSchemas.length-1 && (
                  <Button onClick={onNext} isDisabled={!isValid} fullWidth color='secondary'>
                    Continue
                  </Button>
                )}
                {activeStep === stepSchemas.length-1 && (
                  <Button 
                    type='submit' 
                    isDisabled={!isValid} 
                    isLoading={isSubmitting}  
                    color='secondary'                  
                    fullWidth
                  >
                    Submit
                  </Button>
                )}
              </div>    
            </div>
          </form>
        </FormProvider>
      </CardBody>
    </Card>
  )
}
