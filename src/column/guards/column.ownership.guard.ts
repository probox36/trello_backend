import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { ColumnService } from '../column.service';

interface JwtPayload {
  id: string;
  email: string;
}

interface ColumnParams {
  id?: string;
}

const exception = new ForbiddenException('You do not own the target resource');

@Injectable()
export class ColumnOwnershipGuard implements CanActivate {
  private readonly logger = new Logger(ColumnOwnershipGuard.name);

  constructor(private readonly columnService: ColumnService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request & {
      user: JwtPayload;
    };
    const params = request.params as ColumnParams;
    const currentUserId = request.user.id;
    const body = request.body as { userId?: string };

    this.logger.log(
      `User ${currentUserId} is attempting to access a resource.`,
    );

    if (request.method === 'POST' && body.userId) {
      this.logger.log(
        `POST request with userId: ${body.userId}. Checking user equality.`,
      );
      return this.checkUserEquality(body.userId, currentUserId);
    }

    if (
      (request.method === 'PATCH' || request.method === 'DELETE') &&
      params.id
    ) {
      this.logger.log(
        `${request.method} request for columnId: ${params.id}. Checking column ownership.`,
      );
      return this.checkColumnOwnership(params.id, currentUserId);
    }

    this.logger.warn(
      `Invalid request for ownership guard. Method: ${request.method}, Params: ${JSON.stringify(params)}, Body: ${JSON.stringify(body)}`,
    );
    throw exception;
  }

  private checkUserEquality(reqUserId: string, jwtUserId: string): boolean {
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

  private async checkColumnOwnership(
    columnId: string,
    userId: string,
  ): Promise<boolean> {
    this.logger.log(`Checking if user ${userId} owns column ${columnId}.`);
    const column = await this.columnService.findOne(columnId, {
      user: true,
    });
    if (!column || column.user.id !== userId) {
      this.logger.warn(
        `User ${userId} does not own column ${columnId}. Access denied.`,
      );
      throw exception;
    }
    this.logger.log(`User ${userId} owns column ${columnId}. Access granted.`);
    return true;
  }
}
