'use server';

import { auth } from "@/auth";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { GiMatchTip } from "react-icons/gi";


export default async function Home() {
  const session = await auth(); //server side session data

  return (
    <div className='flex flex-col justify-center items-center mt-20 gap-6 px-5 text-secondary'>
      <GiMatchTip size={100}/>
      <h1 className='text-4xl font-bold'>Welcome to NextMatch</h1>
      { session ? (
        <Button as={Link} href='/members' size='lg' color='secondary' variant='bordered'>
          Continue
        </Button>
      ) :(
        <div className='flex flex-row gap-4'>
          <Button variant="bordered" color='secondary' as={Link} href="/login">
            Login
          </Button>
          <Button variant="bordered" color='secondary' as={Link} href="/register">
            Register
          </Button>
        </div>
      )}
    </div>
  );
}
