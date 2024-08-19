import { randomBytes } from "crypto"; //from node
import { TokenType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function generateToken(email: string, type: TokenType) {
  const token = randomBytes(48).toString("hex"); //unique sequence of bytes
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