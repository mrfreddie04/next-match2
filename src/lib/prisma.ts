import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient};

export const prisma = globalForPrisma.prisma || new PrismaClient({ log: ['query']});

if(process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}


// declare global {
//   var prisma: PrismaClient;
// }

// //const prisma = globalThis.prisma || new PrismaClient({ log: ['query']});
// let prisma = globalThis.prisma;
// if(!prisma) {
//   prisma = new PrismaClient({ log: ['query']});
//   console.log("new PrismaClient");
// }  

// if(process.env.NODE_ENV !== "production") {
//   globalThis.prisma = prisma;
// }

// export { prisma };