import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateColumnDto {
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsInt()
  order: number;

  @IsUUID()
  userId: string;
}
