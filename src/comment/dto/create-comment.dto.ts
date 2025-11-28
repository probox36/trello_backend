import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsInt()
  order: number;

  @IsUUID()
  userId: string;

  @IsUUID()
  cardId: string;
}
