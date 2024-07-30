import { ZodIssueCode } from "zod";

type ActionResult<T> = 
  { status: 'success', data: T } | 
  { status: 'error', error: string | ZodIssue[] }