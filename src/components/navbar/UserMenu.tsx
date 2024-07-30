'use client';

import { signOutUser } from '@/app/actions/authActions';
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/react';
import { Session } from 'next-auth';
import Link from 'next/link';
import React from 'react';

type Props = {
  user: Session["user"]
}

export default function UserMenu({user}: Props) {
  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Avatar 
          isBordered
          as={Button}
          className='transition-transform'
          color='secondary'
          name={user?.name || "user avatar"}
          size='sm'
          src={user?.image || "/images/user.png"}
        />        
      </DropdownTrigger>
      <DropdownMenu aria-label="User actions menu" variant='flat'>
        <DropdownSection showDivider>
          <DropdownItem isReadOnly as='span' key="username" className='h-14 flex flex-row' aria-label='username'>
            Signed in as {user?.name}
          </DropdownItem>
        </DropdownSection>
        <DropdownItem key="edit" as={Link} href='/members/edit'>Edit profile</DropdownItem>
        <DropdownItem key="signout" as={Button} color='danger' onClick={async () => signOutUser()}>
          Log Out
        </DropdownItem>     
    </DropdownMenu>
    </Dropdown>
  );
}  