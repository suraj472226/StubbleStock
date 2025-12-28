import { Request } from 'express';
import { UserRole } from '../constants/roles';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}
