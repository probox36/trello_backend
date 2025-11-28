import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Card } from '../../card/entities/card.entity';

export class ResponseCommentDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  order: number;

  @Transform(({ value }) => (value instanceof User ? value.id : undefined))
  @Expose()
  user: string;

  @Transform(({ value }) => (value instanceof Card ? value.id : undefined))
  @Expose()
  card: string;
}
