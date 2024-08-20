import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { prisma } from "./lib/prisma";
import { Role } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt: async({token, user}) => {
      if(token && user) {
        //console.log("USER", {user});
        token.profileComplete = user.profileComplete;
        token.role = user.role;
      }
      return token;
    },
    session: async({session, token}) => {
      // console.log("SESSION",session);
      // console.log("TOKEN",token);
      if(token?.sub && session?.user) {
        session.user.id = token.sub;
        session.user.profileComplete = token.profileComplete as boolean;
        session.user.role = token.role as Role;
      }      
      return session;
    }
  },
  session: { strategy: "jwt"},
  ...authConfig
});