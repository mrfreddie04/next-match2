'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Filters from './Filters'

export default function FiltersWrapper() {
  const pathname = usePathname();

  if(pathname !== '/members') return null;

  return (<Filters/>);
}  
