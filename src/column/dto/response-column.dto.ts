import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Card } from '../../card/entities/card.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseColumnDto {
  @ApiProperty({
    description: 'The unique identifier (UUID) of the column',
    example: 'd1c2b3a4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The title of the column',
    example: 'In Progress',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'The display order (position) of the column on the board',
    example: 1,
    type: 'integer',
  })
  @Expose()
  order: number;

  @ApiProperty({
    description: 'The UUID of the user who owns this column',
    example: '8b4d1c3a-9e2f-4a5b-6c7d-8e9f0a1b2c3d',
    format: 'uuid',
  })
  @Transform(({ value }) => (value instanceof User ? value.id : undefined))
  @Expose()
  user: string;

  @ApiProperty({
    description:
      'A list of UUIDs representing the cards belonging to this column, ordered by their position',
    example: [
      'c0d1e2f3-g4h5-i6j7-k8l9-m0n1o2p3q4r5',
      'r5q4p3o2-n1m0-l9k8-j7i6-h5g4f3e2d1c0',
    ],
    isArray: true,
    items: {
      type: 'string',
      format: 'uuid',
    },
  })
  @Transform(({ value }) =>
    Array.isArray(value) ? (value as Card[]).map((card) => card.id) : [],
  )
  @Expose()
  cards: string[];
}
