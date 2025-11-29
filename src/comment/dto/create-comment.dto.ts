import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Comment content cannot be empty' })
  @IsString({ message: 'Comment content should be a string' })
  content: string;

  @IsNotEmpty({ message: 'Comment order cannot be empty' })
  @IsInt({ message: 'Comment order should be an integer' })
  order: number;

  @IsNotEmpty({ message: 'User id parameter cannot be empty' })
  @IsUUID(undefined, { message: 'User id parameter should be a UUID' })
  userId: string;

  @IsNotEmpty({ message: 'Card id parameter cannot be empty' })
  @IsUUID(undefined, { message: 'Card id parameter should be a UUID' })
  cardId: string;
}
