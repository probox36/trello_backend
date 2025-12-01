import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
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
  private readonly logger = new Logger(UserOwnershipGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as Request & {
      user: JwtPayload;
    };
    const params = request.params as UserParams;
    const currentUserId = request.user.id;

    this.logger.log(
      `User ${currentUserId} is attempting to access a resource.`,
    );

    if (
      (request.method === 'PATCH' || request.method === 'DELETE') &&
      params.id
    ) {
      this.logger.log(
        `${request.method} request for userId: ${params.id}. Checking user ownership.`,
      );
      return this.checkUserOwnership(params.id, currentUserId);
    }

    this.logger.warn(
      `Invalid request for ownership guard. Method: ${request.method}, Params: ${JSON.stringify(params)}`,
    );
    throw exception;
  }

  private checkUserOwnership(reqUserId: string, jwtUserId: string): boolean {
    this.logger.log(
      `Checking if request user ID ${reqUserId} matches JWT user ID ${jwtUserId}.`,
    );
    if (reqUserId !== jwtUserId) {
      this.logger.warn(
        `User ID mismatch. Request: ${reqUserId}, JWT: ${jwtUserId}. Access denied.`,
      );
      throw exception;
    }
    this.logger.log('User IDs match. Access granted.');
    return true;
  }
}
