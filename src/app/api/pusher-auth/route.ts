import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const session = await auth(); //extract session from the cookie
    if(!session?.user?.id) {
      return new Response('Unauthorized', {status: 401});
    }
    const body = await req.formData();
    const socketId = body.get("socket_id") as string;
    const channel = body.get("channel_name") as string;
    const data = {
      user_id: session.user.id,      
    }
    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
    
    return NextResponse.json(authResponse);
  } catch(e) {

  }
}