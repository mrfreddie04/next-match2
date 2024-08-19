import { DefaultSession } from 'next-auth';

declare module "next-auth" {
  interface User {
    profileComplete: boolean
  }

  // interface AdapterUser {
  //   profileComplete: boolean
  // }

  interface Session {
    user: {
      profileComplete: boolean
    } & DefaultSession["user"]
  }
}

//declare module "@auth/prisma-adapter" {
declare module "@auth/core/adapters" {
  interface AdapterUser {
    profileComplete: boolean;
  }

}

declare module 'next-auth/jwt' {
  interface JWT {
    profileComplete: boolean;
  }
}