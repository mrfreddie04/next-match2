'use server';

import { auth, signOut } from "@/auth";
import { Button } from "@nextui-org/react";
import { FaRegSmile } from "react-icons/fa";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-3xl text-red-500 font-semibold">Hello app!</h1>    
      <h3 className="text-2xl font-semibold">User session data:</h3> 
      {session ? (
        <form action={ async () => {
          "use server"; //may not be necessary
          await signOut();
        }}>
          <div>
            <pre>{JSON.stringify(session, null, 2)}</pre>
          </div>
          <Button 
            type="submit"
            color="primary" 
            variant="bordered" 
            startContent={<FaRegSmile size={20}/>}
          >
            Sign Out
          </Button>        
        </form>
      ): (
        <div>Not signed in</div>
      )}
    </div>
  );
}
