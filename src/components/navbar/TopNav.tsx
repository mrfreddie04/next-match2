'use server';

import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, Button } from "@nextui-org/react";
import Link from 'next/link';
import { GiMatchTip } from 'react-icons/gi';
import NavLink from './NavLink';
import { auth } from '@/auth';
import UserMenu from './UserMenu';
import { getUserInfoForNav } from '@/app/actions/userActions';
import FiltersWrapper from './FiltersWrapper';
import { Role } from '@prisma/client';

export default async function TopNav() {
  const session = await auth();
  const userInfo = session?.user && await getUserInfoForNav();

  const memberLinks = [
    { label: "Matches", href: "/members"},
    { label: "Lists", href: "/lists"},
    { label: "Messages", href: "/messages"},
  ];

  const adminLinks = [
    { label: "Photo Moderation", href: "/admin/moderation"},
  ]  

  const links = userInfo?.role === Role.ADMIN ? adminLinks : memberLinks;
  
  return (
    <>
      <Navbar 
        maxWidth='xl' 
        className='bg-gradient-to-r from-purple-400 to-purple-700'
        classNames={ {item: ['text-xl', 'text-white', 'uppercase', 'data-[active=true]:text-yellow-200']}}
      >
        <NavbarBrand as={Link} href="/">
          <GiMatchTip size={40} className='text-gray-200'/>
          <div className='font-bold text-3xl flex'>
            <span className='text-gray-900'>Next</span>
            <span className='text-gray-200'>Match</span>
          </div>        
        </NavbarBrand>
        <NavbarContent justify="center">
        {links.map( item => (
          <NavLink key={item.href} label={item.label} href={item.href} />
        ))}  
        </NavbarContent>      
        <NavbarContent justify="end">
          { userInfo ? <UserMenu userInfo={userInfo}/> : (
            <>
              <Button variant="bordered" className='text-white' as={Link} href="/login">Login</Button>
              <Button variant="bordered" className='text-white' as={Link} href="/register">Register</Button>
            </>
          )}
        </NavbarContent>
      </Navbar>  
      <FiltersWrapper />
    </>
  )
}
