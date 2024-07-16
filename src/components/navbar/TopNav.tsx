import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, Button } from "@nextui-org/react";
import Link from 'next/link';
import { GiMatchTip } from 'react-icons/gi';
import NavLink from './NavLink';

export default function TopNav() {
  
  return (
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
        <NavLink label="Links" href="/lists"/>
        <NavLink label="Messages" href="/messages"/>
      </NavbarContent>
      <NavbarContent justify="end">
        <Button variant="bordered" className='text-white' as={Link} href="/login">Login</Button>
        <Button variant="bordered" className='text-white' as={Link} href="/register">Register</Button>
      </NavbarContent>
    </Navbar>  
  )
}
