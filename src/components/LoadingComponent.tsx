import { Spinner } from '@nextui-org/react';
import React from 'react';

type Props = {
  label?: string;
}

export default function LoadingComponent({label}: Props) {

  const message = label ?? "Loading...";

  return(
    <div className='flex justify-center items-center vertical-center'>
      <Spinner label={message} color="secondary" labelColor="secondary"/>
    </div>
  );  
}  