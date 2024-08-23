//import { randomBytes } from "crypto"; //from node.js
import { TokenType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function generateToken(email: string, type: TokenType) {
  const arrayBuffer = new Uint8Array(48); //array of 48 bytes
  crypto.getRandomValues(arrayBuffer); //populate buffer array
  const token = Array.from(arrayBuffer, byte => byte.toString(16).padStart(2,"0")).join("");
  //const token = randomBytes(48).toString("hex"); //unique sequence of bytes
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
  
  const existingToken = await getTokenByEmail(email);

  if(existingToken) {
    await prisma.token.delete({
      where: {
        id: existingToken.id
      }
    });
  }

  return await prisma.token.create({
    data: { 
      email, token, expires, type
    },
  });
} 

export async function getTokenByEmail(email: string) {
  try {
    return prisma.token.findFirst({
      where: { email: email }
    });
  } catch(e) {
    console.log(e);
  }
}  

export async function getTokenByToken(token: string) {
  try {
    return prisma.token.findFirst({
      where: { token: token }
    });
  } catch(e) {
    console.log(e);
  }
}  