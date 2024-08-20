import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { membersData } from "./membersData";

const prisma = new PrismaClient();

async function seedMembers() {
  return membersData.map( async (member) => prisma.user.create({
    data: {
      name: member.name,
      email: member.email, 
      emailVerified: new Date(),
      passwordHash: await bcrypt.hash("password", 10),
      image: member.image,
      profileComplete: true,
      member: {
        create: {
          name: member.name,
          gender: member.gender,
          dateOfBirth: new Date(member.dateOfBirth),
          description: member.description,
          city: member.city,
          country: member.country,
          image: member.image,
          createdAt: new Date(member.created),
          updatedAt: new Date(member.lastActive),
          photos: {
            create: [{
              url: member.image,
              createdAt: new Date(member.created),
              updatedAt: new Date(member.lastActive),    
              isApproved: true          
            }]
          }
        }
      }
    }      
  }));
}  

async function seedAdmin() {
  return prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@test.com", 
      emailVerified: new Date(),
      passwordHash: await bcrypt.hash("password", 10),
      role: "ADMIN"
    }      
  });  
}  

async function main() {
  await seedMembers();
  await seedAdmin();
  //await Promise.all(seedMembers());
}

main()
  .catch((e)=>{
    console.error(e);
    process.exit(1);
  })
  .finally( async () => {
    await prisma.$disconnect();
  });