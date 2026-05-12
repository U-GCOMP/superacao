import { Request } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
