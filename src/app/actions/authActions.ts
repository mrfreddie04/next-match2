'use server';

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { RegisterSchema, registerSchema } from "@/lib/schemas/registerSchema";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { ActionResult } from "@/types";
import { delay } from "@/lib/utils";
import { LoginSchema, loginSchema } from "@/lib/schemas/loginSchema";
import { signIn, signOut } from "@/auth";

export async function registerUser(data: RegisterSchema): Promise<ActionResult<User>> {
  //server side validation - just in case server side action was called outside of our next client 
  // in a similar fashion to making a web api request gfrom a tool such as postman
  //it should not be possible, but to stay on the safe side...

  try {
    //repeat client-side validation - we can use zod also on the server side, same logic as on the client
    const validated = registerSchema.safeParse(data);
    if(!validated.success) {
      //handle error
      //we cannot throw error - it is executed on the server (in a different context than the client where the form is submitted)
      //throw new Error(validated.error.errors[0].message)
      //we have to return an object with error info
      //throw new Error(validated.error.errors[0].message);
      return {
        status: "error",
        error: validated.error.errors
      }
    }
  
    //extract form data
    const { name, email, password } = validated.data;
  
    //server side validation - check if user already exists
    const existingUser = await getUserByEmail(email);

    await delay(500);
  
    if(existingUser) {
      return {
        status: "error",
        error: "User already exists"
      }
    }
  
    // hash password
    const passwordHash = await bcrypt.hash(password, 10);
  
    // create a new user
    const user = await prisma.user.create({
      data: {
        name,
        email, 
        passwordHash
      }  
    });
  
    return {
      status: "success",
      data: user
    };

  } catch(e) {
    console.log(e); //report on the server side
    // let message;
    // if (e instanceof Error) message = e.message
    // else message = String(e)
    return {
      status: "error",
      error: "Something went wrong" //message
    }
  }
}

export async function signInUser(data: LoginSchema): Promise<ActionResult<string>> {

  try {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false
    });
    console.log(result);
    return { status: "success", data: "Logged in" };    

  } catch(e) {
    console.log(e); //report DETAILED ERROR on the server side

    //send general error info to the client
    if (e instanceof AuthError) {
      //console.log("TYPE", e.type)
      if(e.type === "CredentialsSignin") 
        return { status: "error", error: "Invalid credentials" };
      return { status: "error", error: "Something went wrong" };
    } else {
      return { status: "error", error: "Something else went wrong" };
    }  
  }
}

export async function signOutUser() {
  await signOut({redirectTo:"/"});
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ 
    where: { email: email }
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ 
    where: { id: id }
  });
}

