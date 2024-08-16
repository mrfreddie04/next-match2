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

export default async function TopNav() {
  const session = await auth();
  const userInfo = session?.user && await getUserInfoForNav();
  
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
          <NavLink label="Matches" href="/members"/>
          <NavLink label="Lists" href="/lists"/>
          <NavLink label="Messages" href="/messages"/>
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
