'use server';

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { ProfileSchema, RegisterSchema, profileSchema, registerSchema, userDetailsSchema } from "@/lib/schemas/registerSchema";
import { prisma } from "@/lib/prisma";
import { TokenType, User } from "@prisma/client";
import { ActionResult } from "@/types";
import { delay } from "@/lib/utils";
import { LoginSchema, loginSchema } from "@/lib/schemas/loginSchema";
import { auth, signIn, signOut } from "@/auth";
import { generateToken, getTokenByToken } from "@/lib/tokens";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
import { ResetPasswordSchema, resetPasswordSchema } from "@/lib/schemas/resetPasswordSchema";

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
    const { name, email, password, gender, dateOfBirth, description, city, country } = validated.data;
  
    //server side validation - check if user already exists
    const existingUser = await getUserByEmail(email);
    if(existingUser) {
      return {
        status: "error",
        error: "User already exists"
      }
    }
  
    // hash password
    const passwordHash = await bcrypt.hash(password, 10);
  
    // create a new user including member data
    const user = await prisma.user.create({
      data: {
        name,
        email, 
        passwordHash,
        profileComplete: true,
        member: {
          create: {
            name: name,
            gender: gender,
            dateOfBirth: new Date(dateOfBirth),
            description: description,
            city: city,
            country: country
        }}          
      }  
    });

    //generate token & send verification email
    const verificationToken = await generateToken(email, TokenType.VERIFICATION);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    await delay(500);
  
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
    //check if email is verified
    const existingUser = await getUserByEmail(data.email);

    if (!existingUser || !existingUser.email) return { status: 'error', error: 'Invalid credentials' }
    
    if(!existingUser.emailVerified) {
      const verificationToken = await generateToken(data.email, TokenType.VERIFICATION);
      await sendVerificationEmail(verificationToken.email, verificationToken.token);

      return { status: 'error', error: 'Please verify your email address before logging in' };
    }

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
      console.log("TYPE", e.type)
      if(e.type === "CredentialsSignin" || e.type === 'CallbackRouteError') 
        return { status: "error", error: "Invalid credentials" };
      return { status: "error", error: "Something went wrong" };
    } else {
      return { status: "error", error: "Something else went wrong" };
    }  
  }
}

export async function completeSocialLoginProfile(data: ProfileSchema): Promise<ActionResult<string>> {
  try {
    const validated = profileSchema.safeParse(data);
    if(!validated.success) {
      return { status: "error", error: validated.error.errors }
    }    

    const session = await auth();
    if(!session?.user) {
      return { status: "error", error: "User not found" }      
    }    

    const userId = session.user.id;

    const { gender, dateOfBirth, description, city, country } = validated.data;

    const user = await prisma.user.update({ 
      where: { id: userId },
      data: { 
        profileComplete: true,
        member: {
          create: {
            name: session.user.name!,
            image: session.user.image,
            gender: gender,
            dateOfBirth: new Date(dateOfBirth),
            description: description,
            city: city,
            country: country
        }}         
      },
      select: {
        accounts: {
          select: { provider: true}
        }
      } 
    });    

    //get authorization provider - stored in Account table
    //Note! What if provider does not exist??? - creste profile???
    //const provider = (user.accounts.length > 0 && user.accounts[0].provider) || 'Uknown provider';
    const provider = user.accounts[0].provider;

    return {
      status: "success",
      data: provider
    }    

  } catch(e) {
    console.log(e); //report on the server side
    return {
      status: "error",
      error: "Something went wrong" //message
    }
  }
}

export async function refreshToken() {

  try {
    const userId = await getAuthUserId();
    const user = await getUserById(userId);
    if(!user) return null;

    //console.log("REFRESH", user);
    const result = await signIn("direct_jwt_auth", {
      email: user.email,
      redirect: false
    });
    console.log(result);
    return { status: "success", data: "Refreshed Token" };    

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

export async function getAuthUserId() {
  const session = await auth();
  const userId = session?.user?.id;

  if(!userId) throw new Error("Unauthorized");

  return userId;
}

export async function getUserRole() {
  const session = await auth();
  const role = session?.user.role;

  if(!role) throw new Error("Not in role");

  return role;
}

export async function verifyEmail(token: string): Promise<ActionResult<string>> {
  try {

    const existingToken = await getTokenByToken(token);
    if(!existingToken) {
      return { status: "error", error: "Invalid token" }
    }

    const hasExpired = existingToken.expires < new Date();
    if(hasExpired) {
      return { status: "error", error: "Token has expired" }
    }    
    
    const existingUser = await getUserByEmail(existingToken.email);
    if(!existingUser) {
      return { status: "error", error: "User not found" }
    }       

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { emailVerified: new Date() },
    });

    await prisma.token.delete({
      where: {id: existingToken.id}
    });

    return { status: "success", data: "Success" };

  } catch(e) {
    console.log(e);
    return { status: "error", error: "Something went wrong" }
  }
}

export async function generateResetPasswordEmail(email: string): Promise<ActionResult<string>> {
  try {
    const existingUser = await getUserByEmail(email);
    if(!existingUser) {
      return { status: "error", error: "Email not found" }
    }     
    
    const token = await generateToken(email, TokenType.PASSWORD_RESET);

    await sendPasswordResetEmail(token.email, token.token)

    return { status: "success", data: "Password reset email has been sent. Please check your email" };

  } catch(e) {
    console.log(e);
    return { status: "error", error: "Something went wrong" }
  }
}

export async function resetPassword(password: string, token?: string | null): Promise<ActionResult<string>> {
  try {
    if(!token) {
      return { status: "error", error: "Missing token" }
    }

    const existingToken = await getTokenByToken(token);
    if(!existingToken) {
      return { status: "error", error: "Invalid token" }
    }

    const hasExpired = existingToken.expires < new Date();
    if(hasExpired) {
      return { status: "error", error: "Token has expired" }
    }    
        
    const existingUser = await getUserByEmail(existingToken.email);
    if(!existingUser) {
      return { status: "error", error: "User not found" }
    }       

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);    

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { passwordHash },
    });

    await prisma.token.delete({
      where: {id: existingToken.id}
    });

    return { status: "success", data: "Password updated successfully. Please, try logging in" };

  } catch(e) {
    console.log(e);
    return { status: "error", error: "Something went wrong" }
  }
}