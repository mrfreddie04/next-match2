import { verifyEmail } from '@/app/actions/authActions';
import CardWrapper from '@/components/CardWrapper';
import ResultMessage from '@/components/ResultMessage';
import { Spinner } from '@nextui-org/react';
import React from 'react';
import { MdOutlineMailOutline } from 'react-icons/md';

type Props = {
  searchParams: { token: string }
}	

export default async function VerifyEmailPage({searchParams}: Props) {
  const result = await verifyEmail(searchParams.token);

  return (
    <CardWrapper
      headerIcon={MdOutlineMailOutline}
      headerText='Verifying your account'
      subHeaderText='You can now login to the app'
      body={
        <div className='flex flex-col space-y-4 items-center'>
          <div className='flex flex-row items-center'>
            <p>Verifying your email address. Please wait...</p>
            {!result && <Spinner color='secondary'/>}
          </div>
        </div>
      }
      footer={<ResultMessage result={result}/>}
    />
  )
}