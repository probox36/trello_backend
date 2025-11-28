import { Expose, Transform } from 'class-transformer';
import { Column } from '../../column/entities/column.entity';
import { Comment } from '../../comment/entities/comment.entity';

export class ResponseCardDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  order: number;

  @Transform(({ value }) => (value instanceof Column ? value.id : undefined))
  @Expose()
  column: string;

  @Transform(({ value }) =>
    Array.isArray(value)
      ? (value as Comment[]).map((comment) => comment.id)
      : [],
  )
  @Expose()
  comments: string[];
}
