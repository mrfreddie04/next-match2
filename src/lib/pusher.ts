import PusherServer from "pusher";
import PusherClient from "pusher-js";

declare global {
  var pusherServerInstance: PusherServer | undefined;
  var pusherClientInstance: PusherClient | undefined;
}

if(!global.pusherServerInstance) {
  global.pusherServerInstance = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true
  });
}

if(!global.pusherClientInstance) {
  global.pusherClientInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
  });
}

// assign global vars to modiule level vars and export
export const pusherClient = global.pusherClientInstance;
export const pusherServer = global.pusherServerInstance;
export const MESSAGE_NEW = "message:new";

