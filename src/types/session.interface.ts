import { Session as BaseSession } from "express-session";
import { Request as BaseRequest } from 'express';
import { Role } from "@prisma/client"

export interface Session extends BaseSession {
  user?: SessionUserData | null;
  permittedRoles?: Role[] | null;
}

export interface Request extends BaseRequest {
  session: Session;
}

export interface SessionUserData {
  id: string;
  name: string;
  email: string;
  role: Role;
}