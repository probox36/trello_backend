import { Exclude, Expose, Transform } from 'class-transformer';
import { TrelloColumn } from '../../column/entities/column.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
  @ApiProperty({
    description: 'The unique identifier (UUID) of the user',
    example: '8b4d1c3a-9e2f-4a5b-6c7d-8e9f0a1b2c3d',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The unique email address of the user',
    example: 'user@example.com',
    format: 'email',
  })
  @Expose()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({
    description: 'A list of UUIDs representing the columns owned by the user',
    example: [
      'd1c2b3a4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
      'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    ],
    isArray: true,
    items: {
      type: 'string',
      format: 'uuid',
    },
  })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? (value as TrelloColumn[]).map((column) => column.id)
      : [],
  )
  @Expose()
  columns: string[];

  @ApiProperty({
    description: 'A list of UUIDs representing the comments authored by the user',
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
      ? (value as TrelloColumn[]).map((comment) => comment.id)
      : [],
  )
  @Expose()
  comments: string[];
}
