import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import type { NextAuthConfig } from "next-auth";
import { loginSchema } from "./lib/schemas/loginSchema";
import { getUserByEmail } from "./app/actions/authActions";

export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET      
    }),
    Credentials({
      id: "credentials",
      name: "credentials",
      authorize: async (credentials) => {
        //validate credentials - the same syntactical validation as in the login form
        const validated = loginSchema.safeParse(credentials);
        
        if(!validated.success) return null;

        const { email, password } = validated.data;

        //verify against db
        const user = await getUserByEmail(email);

        if(!user || !user.passwordHash || !await bcrypt.compare(password, user.passwordHash)) return null;

        return user;
      }
    }),
    Credentials({
      id: "direct_jwt_auth",
      name: "direct_jwt_auth",
      authorize: async (credentials) => {
        const { email } = credentials;
        const user = await getUserByEmail(email as string);
        return user;
      }
    })    
  ],
} satisfies NextAuthConfig;