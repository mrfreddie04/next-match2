import { ZodIssueCode } from "zod";
import { Prisma } from "@prisma/client";

type ActionResult<T> = 
  { status: 'success', data: T } | 
  { status: 'error', error: string | ZodIssue[] }

type LikeType = 'source' | 'target' | 'mutual';

type NavLinkType = {
  name: string;
  href: string;
}

type MessageWithSenderRecipient = Prisma.MessageGetPayload<{
  select: {
    id: true, 
    text: true, 
    createdAt: true, 
    dateRead: true,
    sender: { select: {userId: true, name: true, image: true}}, 
    recipient: { select: {userId: true, name: true, image: true}}
  }
}>;


type MessageDto = {
  id: string, 
  text: string, 
  createdAt: string, 
  dateRead: string | null,
  senderId?: string,
  senderName?: string,
  senderImage?: string | null,
  recipientId?: string,
  recipientName?: string,
  recipientImage?: string | null  
}

type MessageContainer = "inbox" | "outbox";

type MessageDtoFields = keyof MessageDto;

type LikeNew = Prisma.LikeGetPayload<{
  select: {
    sourceMember: { select: {userId: true, name: true, image: true} }
  }  
}>

type LikeDto = {
  userId: string, 
  name: string, 
  image?: string | null,
}

//filters
type UserFilters = {
  ageRange: number[];
  gender: string[];
  orderBy: string;
  withPhoto: boolean;
}

//pagination - request sent to the server - from "Pagination" & "Page size" components
type PagingParams = {
  pageSize: number;
  pageNumber: number;
}

//pagination - paging result - to populate "Pagination" component (total num of pages), and showing "1-10 of 23"
type PagingResult = {
  totalPages: number;
  totalCount: number;
} & PagingParams;

type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
}

// QS params
type GetMemberParams = {
  ageRange?: string | null;
  gender?: string | null;
  orderBy?: string | null;
  pageNumber?: string | null;
  pageSize?: string | null;
  withPhoto?: string | null;
}

type CursorResponse<T,C> = {
  messages: T[],
  nextCursor: C | undefined
}

type Gender = "male" | "female";

type AuthProvider = 'github' | 'google';