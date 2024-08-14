'use client';

import React from 'react'
import { NavbarItem } from '@nextui-org/react'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import useMessageStore from '@/hooks/useMessageStore';

type Props = {
  href: string;
  label: string;
  [key: string]: any;
}

export default function NavLink({href, label,...props}: Props) {
  const pathname = usePathname();

  const { unreadCount } = useMessageStore( state => ({
    unreadCount: state.unreadCount
  }));     

  return (
    <NavbarItem {...props} as={Link} href={href} isActive={pathname===href}>
      <span className=''>{label}</span>
      { href === '/messages' && (
        <span className='ml-1'>({unreadCount})</span>
      )}
    </NavbarItem>
  )
}
