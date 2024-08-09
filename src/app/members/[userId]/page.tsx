import React from 'react';
import { getMemberByUserId } from '@/app/actions/memberActions';
import { notFound } from 'next/navigation';
import CardInnerWrapper from '@/components/CardInnerWrapper';

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
    <CardInnerWrapper 
      header="Profile" 
      body={<div>{member.description}</div>}
    />
  );
}