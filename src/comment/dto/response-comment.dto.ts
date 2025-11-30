import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Card } from '../../card/entities/card.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseCommentDto {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier (UUID) of the comment',
    example: 'c1b2a3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    format: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'The text content of the comment',
    example: 'This task requires a review from the QA team.',
  })
  content: string;

  @Expose()
  @ApiProperty({
    description: 'The display order (position) of the comment within the card',
    example: 2,
    type: 'integer',
  })
  order: number;

  @ApiProperty({
    description: 'The UUID of the user who authored this comment',
    example: '8b4d1c3a-9e2f-4a5b-6c7d-8e9f0a1b2c3d',
    format: 'uuid',
  })
  @Transform(({ value }) => (value instanceof User ? value.id : undefined))
  @Expose()
  user: string;

  @ApiProperty({
    description: 'The UUID of the card the comment is attached to',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    format: 'uuid',
  })
  @Transform(({ value }) => (value instanceof Card ? value.id : undefined))
  @Expose()
  card: string;
}
