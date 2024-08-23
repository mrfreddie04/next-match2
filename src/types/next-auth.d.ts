import { DefaultSession } from 'next-auth';
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    profileComplete: boolean;
    role: Role;
  }

  interface Session {
    user: {
      profileComplete: boolean;
      role: Role;
    } & DefaultSession["user"]
  }
}

//declare module "@auth/prisma-adapter" {
// declare module "@auth/core/adapters" {
//   interface AdapterUser {
//     profileComplete: boolean;
//     role: Role;
//   }
// }

declare module 'next-auth/jwt' {
  interface JWT {
    profileComplete: boolean;
    role: Role;
  }
}