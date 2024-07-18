import { Request } from 'express';
import { Types , Schema} from 'mongoose';

export interface UserPayload {
  id: Types.ObjectId;
  role: 'admin' | 'user';
  username: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export interface TaskRequestBody {
    title?: string;
    description?: string;
    ownerId?: Schema.Types.ObjectId;
    author?: string;
}
