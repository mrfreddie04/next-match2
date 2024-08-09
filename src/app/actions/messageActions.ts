'use server';

import { prisma } from "@/lib/prisma";
import { MessageSchema, messageSchema } from "@/lib/schemas/messageSchema";
import { ActionResult, MessageDto, MessageWithSenderRecipient, MessageContainer } from "@/types";
import { Message } from "@prisma/client";
import { getAuthUserId } from "./authActions";
import { mapMessageToMessageDto } from "@/lib/mappings";
import { delay } from "@/lib/utils";

export async function createMessage(recipientUserId: string, data: MessageSchema): Promise<ActionResult<Message>> {
  try {
    const validated = messageSchema.safeParse(data);
    if(!validated.success) {
      return {
        status: "error",
        error: validated.error.errors
      }
    }

    const userId = await getAuthUserId();

    const { text } = validated.data;

    const message = await prisma.message.create({
      data: {
        senderId: userId,
        recipientId: recipientUserId,
        text: text
      }  
    });     

    return {
      status: "success",
      data: message
    }

  } catch(e) {
    console.log(e);
    return {
      status: "error",
      error: "Something went wrong"
    }
  }
}

export async function getMessageThread(recipientUserId: string): Promise<MessageDto[]> {
  try {
    const userId = await getAuthUserId();

    const messages: MessageWithSenderRecipient[] = await prisma.message.findMany({
      where: { 
        OR: [
          {senderId: userId, recipientId: recipientUserId, senderDeleted: false},
          {senderId: recipientUserId, recipientId: userId, recipientDeleted: false}
        ]
      },
      orderBy: [
        {
          createdAt: 'asc',
        }
      ],      
      select: {
        id: true, 
        text: true, 
        createdAt: true, 
        dateRead: true,
        sender: { select: {userId: true, name: true, image: true} },
        recipient: { select: {userId: true, name: true, image: true} },
      }
    });

    //mark inbox messages as read
    if(messages.length > 0) {
      await prisma.message.updateMany({
        where: {
          senderId: recipientUserId,
          recipientId: userId, 
          dateRead: null
        },
        data: {
          dateRead: new Date()
        }
      });
    }

    return messages.map( (message) => mapMessageToMessageDto(message));

  } catch(e) {
    console.log(e);
    throw e;
  }
}

export async function getMessagesByContainer(container: MessageContainer) {
  try {
    const userId = await getAuthUserId();
    
    const conditions = {
      [container === 'outbox' ? 'senderId' : 'recipientId']: userId,
      //[container === 'outbox' ? 'senderDeleted' : 'recipientDeleted']: false,
      ...(container === 'outbox' ? {senderDeleted: false} :{recipientDeleted: false})
    };  

    const messages = await prisma.message.findMany({
      where: conditions,
      orderBy: { createdAt: 'desc' },      
      select: {
        id: true, 
        text: true, 
        createdAt: true, 
        dateRead: true,
        sender: { select: {userId: true, name: true, image: true} },
        recipient: { select: {userId: true, name: true, image: true} },
      }
    });

    return messages.map( (message) => mapMessageToMessageDto(message));

  } catch(e) {
    console.log(e);
    throw e;
  } 
}

export async function deleteMessage(messageId: string, isOutbox: boolean) {
  try {
    const selectorUserId = isOutbox ? "senderId": "recipientId";
    const selectorDeleted = isOutbox ? "senderDeleted": "recipientDeleted";
    const userId = await getAuthUserId();

    const message = await prisma.message.update({
      where: { id: messageId, [selectorUserId]: userId},
      data: {
        [selectorDeleted]: true
      }
    });

    // if(message.senderDeleted && message.recipientDeleted) {
    //   //delete
    //   await prisma.message.delete({
    //     where: { id: messageId, [selectorUserId]: userId},
    //   });      
    // }    

    const messagesToDelete = await prisma.message.findMany({
      where: { 
        OR: [
          {senderId: userId},
          {recipientId: userId}
        ],
        senderDeleted: true,
        recipientDeleted: true
      }
    });

    if(messagesToDelete.length > 0) {
      await prisma.message.deleteMany({
        where: {
          //id: { in: messagesToDelete.map(message => message.id)}
          OR: messagesToDelete.map(message => ({id: message.id}))
        }
      })
    }

    //await delay(100);
    console.log("DELETED")

  } catch(e) {
    console.log(e);
    throw e;
  } 
}  