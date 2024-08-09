
import { MessageWithSenderRecipient, MessageDto } from "@/types";
import { formatShortDateTime } from "./utils";

export function mapMessageToMessageDto(message: MessageWithSenderRecipient ): MessageDto {
  return  {
    id: message.id, 
    text: message.text, 
    createdAt: formatShortDateTime(message.createdAt), 
    dateRead: message.dateRead ? formatShortDateTime(message.dateRead) : null,
    senderId: message.sender?.userId,
    senderName: message.sender?.name,
    senderImage: message.sender?.image,
    recipientId: message.recipient?.userId,
    recipientName: message.recipient?.name,
    recipientImage: message.recipient?.image
  }
}