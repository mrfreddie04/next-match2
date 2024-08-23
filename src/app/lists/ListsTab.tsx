'use client';

import { LikeType } from '@/types';
import { Tab, Tabs, Spinner } from '@nextui-org/react';
import { Member } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Key, useTransition } from 'react';
import MemberCard from '../members/MemberCard';

type Props = {
  members: Member[];
  likeIds: string[];
}

export default function ListsTab({members, likeIds}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const tabs: {id: LikeType, label: string}[] = [
    { id: 'source', label: 'Members I have liked'},
    { id: 'target', label: 'Members that like me'},
    { id: 'mutual', label: 'Mutual likes'}
  ];

  const handleTabChange = (key: Key) => {
    //console.log("Tab Change", key);
    startTransition(() => {
      //update the state via URL which should result in rerender of ListsTab component with data for this key
      const params = new URLSearchParams(searchParams);
      params.set("type", key.toString());
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className='flex w-full flex-col mt-10 gap-5'>
      <div className='flex flex-row items-center'>         
        <Tabs 
          aria-label='Like tabs'
          color='secondary'
          onSelectionChange={(key) => handleTabChange(key)}
        >
          {tabs.map( item => (
            <Tab key={item.id} title={item.label}/>
          ))}
        </Tabs>
        { isPending && (<Spinner className='self-center ml-3' color='secondary' labelColor="secondary"/>) }
      </div>
        {tabs.filter( item => item.id === searchParams.get("type")).map( item => (
          <div key={item.id}>
            {members.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                {members.map( member => (
                  <MemberCard key={member.id} member={member} likeIds={likeIds}/>
                ))}
              </div>
            ) : (
              <div>No members for this filter</div>
            )}
          </div>
        ))}
    </div>
  )
}




/**
 * 
          <Tab key={item.id} title={item.label}>
            { isPending ? (
              <LoadingComponent label="Loading members..."/>
            ) :(
              <>
                {members.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                    {members.map( member => (
                      <MemberCard key={member.id} member={member} likeIds={likeIds}/>
                    ))}
                  </div>
                ) : (
                  <div>No members for this filter</div>
                )}
              </>
            )}
          </Tab>)
 */