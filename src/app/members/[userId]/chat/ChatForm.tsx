'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { HiPaperAirplane } from 'react-icons/hi2';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@nextui-org/react';
import { MessageSchema, messageSchema } from '@/lib/schemas/messageSchema';
import { createMessage } from '@/app/actions/messageActions';
import { handleFormServerErrors } from '@/lib/utils';

export default function ChatForm() {  
  const { userId } = useParams<{userId:string}>();

  const { register, handleSubmit, reset, setError, setFocus,
    formState: {errors, isDirty, isValid, isSubmitting} } = useForm<MessageSchema>({
      resolver: zodResolver(messageSchema),
      mode: "onTouched"
    });

  const router = useRouter();  
  
  useEffect(() => {
    setFocus("text");
  },[setFocus]);  

  const onSubmit: SubmitHandler<MessageSchema> = async (data) => {
    const result = await createMessage(userId, data);
    if(result.status === "success") {
      reset(); //resets field value & isDirty flag 
      router.refresh(); //will update user interface - display new message
      setTimeout(() => setFocus("text"), 100);
    } else if(result.status === "error") {
      handleFormServerErrors(result, setError);
    }    
  }  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
      <div className='flex items-center gap-2'>
        <Input
          fullWidth
          placeholder='Type a message'
          defaultValue=""
          variant='faded'
          isInvalid={!!errors.text}
          errorMessage={errors.text?.message}
          {...register('text')}
        />                    
        <Button 
          type="submit" 
          isIconOnly
          color='secondary' 
          radius='full'
          isDisabled={!isValid || !isDirty || isSubmitting} 
          isLoading={isSubmitting}
        >
          <HiPaperAirplane size={18}/>
        </Button>
      </div>
      {/* {true && (
          <p className='text-danger text-sm'>Test Error</p>
        )}  
      */}
      {errors.root?.serverError && (
        <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
      )}      

    </form>
  );
}