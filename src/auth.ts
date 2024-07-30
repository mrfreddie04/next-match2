import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { prisma } from "./lib/prisma";

 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    // jwt: async({token}) => {
    //   if(token && token.sub) {
    //     console.log("TOKEN",token);
    //   }
    //   return token;
    // },
    session: async({session,token}) => {
      //console.log("SESSION",session);
      //console.log("TOKEN",token);
      if(token?.sub && session?.user) {
        session.user.id = token.sub;
      }      
      return session;
    }
  },
  session: { strategy: "jwt"},
  ...authConfig
});