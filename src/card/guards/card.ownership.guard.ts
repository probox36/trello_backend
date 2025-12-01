import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ColumnService } from '../../column/column.service';
import { CardService } from '../card.service';
import { Request } from 'express';

interface JwtPayload {
  id: string;
  email: string;
}

interface CardParams {
  id?: string;
}

const exception = new ForbiddenException('You do not own the target resource');

@Injectable()
export class CardOwnershipGuard implements CanActivate {
  constructor(
    private readonly columnService: ColumnService,
    private readonly cardService: CardService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request & {
      user: JwtPayload;
    };
    const params = request.params as CardParams;
    const currentUserId = request.user.id;
    const body = request.body as { columnId?: string };

    if (request.method === 'POST' && body.columnId) {
      return this.checkColumnOwnership(body.columnId, currentUserId);
    }

    if (
      (request.method === 'PATCH' || request.method === 'DELETE') &&
      params.id
    ) {
      return this.checkCardOwnership(params.id, currentUserId);
    }

    throw exception;
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

  private async checkCardOwnership(
    cardId: string,
    userId: string,
  ): Promise<boolean> {
    const card = await this.cardService.findOne(cardId, {
      column: { user: true },
    });

    if (!card || card.column.user.id !== userId) {
      throw exception;
    }
    return true;
  }
}
