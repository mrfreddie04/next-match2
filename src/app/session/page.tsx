'use server';

import { auth } from "@/auth";
import ClientSession from "@/components/ClientSession";

export default async function SessionPage() {
  const session = await auth(); //server side session data

  return (
    <div className='flex flex-row justify-around mt-20 gap-6 px-5'>
      <div className='bg-green-50 p-10 rounded-xl shadow-md w-1/2 overflow-auto'>
        <h3 className='text-2xl font-semibold'>Server session data:</h3> 
        {session ? (
          <div>
            <pre>{JSON.stringify(session, null, 2)}</pre>
          </div>
        ): (
          <div>Not signed in</div>
        )}
      </div>
      <ClientSession />
    </div>
  );
}