import { Exclude, Expose, Transform } from 'class-transformer';
import { Column } from '../../column/entities/column.entity';

export class ResponseUserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Transform(({ value }) =>
    Array.isArray(value) ? (value as Column[]).map((column) => column.id) : [],
  )
  @Expose()
  columns: string[];

  @Transform(({ value }) =>
    Array.isArray(value)
      ? (value as Column[]).map((comment) => comment.id)
      : [],
  )
  @Expose()
  comments: string[];
}
