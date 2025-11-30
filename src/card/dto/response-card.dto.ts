import { Expose, Transform } from 'class-transformer';
import { TrelloColumn } from '../../column/entities/column.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseCardDto {
  @ApiProperty({
    description: 'The unique identifier (UUID) of the card',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The title of the card',
    example: 'Implement authentication feature',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Content or description of the card',
    example: 'Requires JWT strategy and login endpoint.',
  })
  @Expose()
  content: string;

  @ApiProperty({
    description: 'The display order of the card within its column',
    example: 1,
    type: 'integer',
  })
  @Expose()
  order: number;

  @ApiProperty({
    description: 'The UUID of the column that this card belongs to',
    example: 'x9y8z7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4',
    format: 'uuid',
  })
  @Transform(({ value }) =>
    value instanceof TrelloColumn ? value.id : undefined,
  )
  @Expose()
  column: string;

  @ApiProperty({
    description:
      'A list of UUIDs representing the comments associated with this card',
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
    Array.isArray(value)
      ? (value as Comment[]).map((comment) => comment.id)
      : [],
  )
  @Expose()
  comments: string[];
}
