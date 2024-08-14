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
    channelAuthorization: {
      endpoint: '/api/pusher-auth',
      transport: 'ajax'
    },
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
  });
}

// assign global vars to modiule level vars and export
export const pusherClient = global.pusherClientInstance;
export const pusherServer = global.pusherServerInstance;

// channel 
export const CHANNEL_PRESENCE_NM = "presence-nm";

// events
export const EVENT_LIKE_NEW = "like:new";
export const EVENT_MESSAGE_NEW = "message:new";
export const EVENT_MESSAGES_READ = "messages:read";
export const EVENT_PRESENCE_SUBSCRIPTION_SUCCEEDED = "pusher:subscription_succeeded";
export const EVENT_PRESENCE_MEMBER_ADDED = "pusher:member_added";
export const EVENT_PRESENCE_MEMBER_REMOVED = "pusher:member_removed";
