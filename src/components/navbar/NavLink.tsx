'use client';

import React from 'react'
import { NavbarItem } from '@nextui-org/react'
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type Props = {
  href: string;
  label: string;
  [key: string]: any;
}

export default function NavLink({href, label,...props}: Props) {
  const pathname = usePathname();

  return (
    <NavbarItem {...props} as={Link} href={href} isActive={pathname===href}>
      {label}
    </NavbarItem>
  )
}
