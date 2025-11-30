import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
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
  constructor(private readonly commentService: CommentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request & {
      user: JwtPayload;
    };
    const params = request.params as CommentParams;
    const currentUserId = request.user.id;

    if (
      (request.method === 'PATCH' || request.method === 'DELETE') &&
      params.id
    ) {
      return this.checkCommentOwnership(params.id, currentUserId);
    }

    throw exception;
  }

  private async checkCommentOwnership(
    commentId: string,
    userId: string,
  ): Promise<boolean> {
    const comment = await this.commentService.findOne(commentId, {
      user: true,
    });

    if (!comment || comment.user.id !== userId) {
      throw exception;
    }
    return true;
  }
}
