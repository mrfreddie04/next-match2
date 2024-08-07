'use client';

import React, { useEffect } from 'react';
import { Member } from '@prisma/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { MemberEditSchema, memberEditSchema } from '@/lib/schemas/memberEditSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Textarea } from '@nextui-org/react';
import { updateMemberProfile } from '@/app/actions/userActions';
import { toast } from 'react-toastify';
import { handleFormServerErrors } from '@/lib/utils';

type Props = {
  member: Member
}

export default function EditForm({member}: Props) {  
  const { register, handleSubmit, reset, setError,
    formState: {errors, isDirty, isValid, isSubmitting} } = useForm<MemberEditSchema>({
      resolver: zodResolver(memberEditSchema),
      mode: "onTouched"
    });

  const router = useRouter();  

  useEffect( () => {
    if(member) {
      reset({
        name: member.name,
        description: member.description,
        city: member.city,
        country: member.country
      });
    }
  }, [member, reset]);

  const onSubmit: SubmitHandler<MemberEditSchema> = async (data) => {
    //console.log(data);
    const nameUpdated = data.name !== member.name;
    const result = await updateMemberProfile(data, nameUpdated);
    if(result.status === "success") {
      toast.success("Profile updated");
      router.refresh(); //refreshes the current page      
      reset({...data}); //resets isDirty flag 
    } else if(result.status === "error") {
      handleFormServerErrors(result, setError);
    }    
  }  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
      <div className='space-y-4'> 
        <Input
          defaultValue={member.name}
          label='Name'
          variant='bordered'
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          {...register('name')}
        />
        <Textarea
          defaultValue={member.description}
          label='Description'
          variant='bordered'
          isInvalid={!!errors.description}
          errorMessage={errors.description?.message}
          {...register('description')}
          minRows={6}
        /> 
        <div className='flex flex-row gap-3'>
          <Input
            defaultValue={member.city}
            label='City'
            variant='bordered'
            isInvalid={!!errors.city}
            errorMessage={errors.city?.message}
            {...register('city')}
          />    
          <Input
            defaultValue={member.country}
            label='Country'
            variant='bordered'
            isInvalid={!!errors.country}
            errorMessage={errors.country?.message}
            {...register('country')}
          />                                     
        </div>   
        {errors.root?.serverError && (
          <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
        )}                      
        <Button type="submit" 
          color='secondary' 
          className='flex self-end'
          variant='solid'
          isDisabled={!isValid || !isDirty} 
          isLoading={isSubmitting}
        >
          Update Profile
        </Button>
      </div>
    </form>
  );
}