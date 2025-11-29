import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty({ message: 'Card title cannot be empty' })
  @IsString({ message: 'Card title should be a string' })
  title: string;

  @IsNotEmpty({ message: 'Card content cannot be empty' })
  @IsString({ message: 'Card content should be a string' })
  content: string;

  @IsNotEmpty({ message: 'Card order cannot be empty' })
  @IsInt({ message: 'Card order should be an integer' })
  @Min(0, { message: 'Order should be >= 0' })
  order: number;

  @IsNotEmpty({ message: 'Column id parameter cannot be empty' })
  @IsUUID(undefined, { message: 'Column id parameter should be a UUID' })
  columnId: string;
}
