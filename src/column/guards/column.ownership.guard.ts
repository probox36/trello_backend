import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
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
  constructor(private readonly columnService: ColumnService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request & {
      user: JwtPayload;
    };
    const params = request.params as ColumnParams;
    const currentUserId = request.user.id;
    const body = request.body as { userId?: string };

    if (request.method === 'POST' && body.userId) {
      return this.checkUserEquality(body.userId, currentUserId);
    }

    if (
      (request.method === 'PATCH' || request.method === 'DELETE') &&
      params.id
    ) {
      return this.checkColumnOwnership(params.id, currentUserId);
    }

    throw exception;
  }

  private checkUserEquality(reqUserId: string, JwtUserId: string): boolean {
    if (reqUserId !== JwtUserId) {
      throw exception;
    }
    return true;
  }

  private async checkColumnOwnership(
    columnId: string,
    userId: string,
  ): Promise<boolean> {
    const column = await this.columnService.findOne(columnId, {
      user: true,
    });

    if (!column || column.user.id !== userId) {
      throw exception;
    }
    return true;
  }
}
