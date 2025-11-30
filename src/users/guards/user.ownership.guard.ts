import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

interface JwtPayload {
  id: string;
  email: string;
}

interface UserParams {
  id?: string;
}

const exception = new ForbiddenException('You do not own the target resource');

@Injectable()
export class UserOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as Request & {
      user: JwtPayload;
    };
    const params = request.params as UserParams;
    const currentUserId = request.user.id;

    if (
      (request.method === 'PATCH' || request.method === 'DELETE') &&
      params.id
    ) {
      return this.checkCardOwnership(params.id, currentUserId);
    }

    throw exception;
  }

  private checkCardOwnership(reqUserId: string, jwtUserId: string): boolean {
    if (reqUserId !== jwtUserId) {
      throw exception;
    }
    return true;
  }
}
