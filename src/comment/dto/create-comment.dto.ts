import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Comment content cannot be empty' })
  @IsString({ message: 'Comment content should be a string' })
  @ApiProperty({
    description: 'The content (text body) of the new comment',
    example: 'I have started implementing the feature now.',
    minLength: 1,
  })
  content: string;

  @IsNotEmpty({ message: 'Comment order cannot be empty' })
  @IsInt({ message: 'Comment order should be an integer' })
  @ApiProperty({
    description: 'The display order (position) of the comment within the card',
    example: 0,
    type: 'integer',
    minimum: 0,
  })
  order: number;

  @IsNotEmpty({ message: 'User id parameter cannot be empty' })
  @IsUUID(undefined, { message: 'User id parameter should be a UUID' })
  @ApiProperty({
    description: 'The unique identifier (UUID) of the user who authored the comment',
    example: '8b4d1c3a-9e2f-4a5b-6c7d-8e9f0a1b2c3d',
    format: 'uuid',
  })
  userId: string;

  @IsNotEmpty({ message: 'Card id parameter cannot be empty' })
  @IsUUID(undefined, { message: 'Card id parameter should be a UUID' })
  @ApiProperty({
    description: 'The unique identifier (UUID) of the card the comment is attached to',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    format: 'uuid',
  })
  cardId: string;
}
