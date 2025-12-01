import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
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
  private readonly logger = new Logger(CardOwnershipGuard.name);

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

    this.logger.log(
      `User ${currentUserId} is attempting to access a resource.`,
    );

    if (request.method === 'POST' && body.columnId) {
      this.logger.log(
        `POST request with columnId: ${body.columnId}. Checking column ownership.`,
      );
      return this.checkColumnOwnership(body.columnId, currentUserId);
    }

    if (
      (request.method === 'PATCH' || request.method === 'DELETE') &&
      params.id
    ) {
      this.logger.log(
        `${request.method} request for cardId: ${params.id}. Checking card ownership.`,
      );
      return this.checkCardOwnership(params.id, currentUserId);
    }

    this.logger.warn(
      `Invalid request for ownership guard. Method: ${request.method}, Params: ${JSON.stringify(params)}, Body: ${JSON.stringify(body)}`,
    );
    throw exception;
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

  private async checkCardOwnership(
    cardId: string,
    userId: string,
  ): Promise<boolean> {
    this.logger.log(`Checking if user ${userId} owns card ${cardId}.`);
    const card = await this.cardService.findOne(cardId, {
      column: { user: true },
    });

    if (!card || card.column.user.id !== userId) {
      this.logger.warn(
        `User ${userId} does not own card ${cardId}. Access denied.`,
      );
      throw exception;
    }
    this.logger.log(`User ${userId} owns card ${cardId}. Access granted.`);
    return true;
  }
}
