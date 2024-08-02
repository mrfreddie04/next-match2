import React from 'react';
import { getMemberByUserId } from '@/app/actions/memberActions';
import { notFound } from 'next/navigation';
import { CardBody, CardHeader, Divider } from '@nextui-org/react';

type Props = {
  params: {
    userId: string
  }
}  

export default async function MemberDetailedPage({params}: Props) {

  const member = await getMemberByUserId(params.userId);

  if(!member) {
    return notFound();
  }

  return (
    <>
      <CardHeader className='text-2xl font-semibold text-secondary'>
        Profile
      </CardHeader>
      <Divider />
      <CardBody>
        {member.description}
      </CardBody>
    </>
  );
}