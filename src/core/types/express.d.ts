import { Request } from 'express';
import { ErrorsMessages } from '../types/errorsMessagesTypes';

declare global {
  namespace Express {
    interface Request {
      errorsMessages?: ErrorsMessages
    }
  }
}
