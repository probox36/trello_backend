import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from '../comment.service';

interface JwtPayload {
  id: string;
  email: string;
}

interface CommentParams {
  id?: string;
}

const exception = new ForbiddenException('You do not own the target resource');

@Injectable()
export class CommentOwnershipGuard implements CanActivate {
  private readonly logger = new Logger(CommentOwnershipGuard.name);

  constructor(private readonly commentService: CommentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request & {
      user: JwtPayload;
    };
    const params = request.params as CommentParams;
    const currentUserId = request.user.id;

    this.logger.log(
      `User ${currentUserId} is attempting to access a resource.`,
    );

    if (
      (request.method === 'PATCH' || request.method === 'DELETE') &&
      params.id
    ) {
      this.logger.log(
        `${request.method} request for commentId: ${params.id}. Checking comment ownership.`,
      );
      return this.checkCommentOwnership(params.id, currentUserId);
    }

    this.logger.warn(
      `Invalid request for ownership guard. Method: ${request.method}, Params: ${JSON.stringify(params)}`,
    );
    throw exception;
  }

  private async checkCommentOwnership(
    commentId: string,
    userId: string,
  ): Promise<boolean> {
    this.logger.log(`Checking if user ${userId} owns comment ${commentId}.`);
    const comment = await this.commentService.findOne(commentId, {
      user: true,
    });

    if (!comment || comment.user.id !== userId) {
      this.logger.warn(
        `User ${userId} does not own comment ${commentId}. Access denied.`,
      );
      throw exception;
    }
    this.logger.log(
      `User ${userId} owns comment ${commentId}. Access granted.`,
    );
    return true;
  }
}
