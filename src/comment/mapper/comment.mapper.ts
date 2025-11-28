import { Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Card } from '../../card/entities/card.entity';
import { Comment } from '../entities/comment.entity';
import { ResponseCommentDto } from '../dto/response-comment.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CommentMapper {
  toEntity(dto: CreateCommentDto): Comment {
    return {
      ...dto,
      card: { id: dto.cardId } as Card,
      user: { id: dto.userId } as User,
    };
  }

  toDto(comment: Comment): ResponseCommentDto {
    return plainToInstance(ResponseCommentDto, comment, {
      excludeExtraneousValues: true,
    });
  }
}
