import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateColumnDto {
  @IsNotEmpty({ message: 'Column title cannot be empty' })
  @IsString({ message: 'Column title should be a string' })
  title: string;

  @IsNotEmpty({ message: 'Column order cannot be empty' })
  @IsInt({ message: 'Column title should be an integer' })
  order: number;

  @IsNotEmpty({ message: 'User id parameter cannot be empty' })
  @IsUUID(undefined, { message: 'User id parameter should be a UUID' })
  userId: string;
}
