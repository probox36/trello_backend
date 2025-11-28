import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Card } from '../../card/entities/card.entity';

export class ResponseColumnDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  order: number;

  @Transform(({ value }) => (value instanceof User ? value.id : undefined))
  @Expose()
  user: string;

  @Transform(({ value }) =>
    Array.isArray(value) ? (value as Card[]).map((card) => card.id) : [],
  )
  @Expose()
  cards: string[];
}
