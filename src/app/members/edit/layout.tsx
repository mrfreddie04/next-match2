import { getMemberByUserId } from "@/app/actions/memberActions";
import MemberSidebar from "../MemberSidebar";
import { notFound } from "next/navigation";
import { Card } from "@nextui-org/react";
import { getAuthUserId } from "@/app/actions/authActions";

type Props = Readonly<{
  children: React.ReactNode
}>;

export default async function MemberEditLayout({children}: Props) {
  const userId = await getAuthUserId();
  const member = await getMemberByUserId(userId);

  if(!member) {
    return notFound();
  }

  const basePath = `/members/edit`;

  const navLinks = [
    { name: "Edit Profile", href: `${basePath}` },
    { name: "Update Photos", href: `${basePath}/photos` }
  ];  

  //console.log("Member Edit");

  return (
    <div className="grid grid-cols-12 gap-5 h-[80vh] mx-6">
      <div className="col-span-3">
        <MemberSidebar member={member} navLinks={navLinks}/>
      </div>
      <div className="col-span-9">
        <Card className="w-full mt-10 h-[80vh]">
          {children}
        </Card>
      </div>
    </div>
  );
}
