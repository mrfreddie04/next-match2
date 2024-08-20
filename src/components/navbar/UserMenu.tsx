'use client';

import { signOutUser } from '@/app/actions/authActions';
import { transformImageUrl } from '@/lib/utils';
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/react';
import { Role } from '@prisma/client';
//import { Session } from 'next-auth';
import Link from 'next/link';
import React from 'react';

type Props = {
  userInfo: {
    name: string | null,
    image: string | null,
    role: Role
  } | null //Session["user"]
}

export default function UserMenu({userInfo}: Props) {

  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Avatar 
          isBordered
          as='button'
          className='transition-transform'
          color='secondary'
          name={userInfo?.name || "user avatar"}
          size='sm'
          radius="full"
          src={transformImageUrl(userInfo?.image) || "/images/user.png"}
        />        
      </DropdownTrigger>
      <DropdownMenu aria-label="User actions menu" variant='flat'>
        <DropdownSection showDivider>
          <DropdownItem isReadOnly as='span' key="username" className='h-14 flex flex-row' aria-label='username'>
            Signed in as {userInfo?.name}
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