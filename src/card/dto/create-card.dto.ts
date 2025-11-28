import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class CreateCardDto {
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order: number;

  @IsUUID()
  columnId: string;
}
