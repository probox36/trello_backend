import { Exclude, Expose, Transform } from 'class-transformer';
import { TrelloColumn } from '../../column/entities/column.entity';

export class ResponseUserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Transform(({ value }) =>
    Array.isArray(value)
      ? (value as TrelloColumn[]).map((column) => column.id)
      : [],
  )
  @Expose()
  columns: string[];

  @Transform(({ value }) =>
    Array.isArray(value)
      ? (value as TrelloColumn[]).map((comment) => comment.id)
      : [],
  )
  @Expose()
  comments: string[];
}
