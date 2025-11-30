import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateColumnDto {
  @ApiProperty({
    description: 'The title of the new column (e.g., To Do, In Progress, Done)',
    example: 'To Do',
    minLength: 1,
  })
  @IsNotEmpty({ message: 'Column title cannot be empty' })
  @IsString({ message: 'Column title should be a string' })
  title: string;

  @ApiProperty({
    description: 'The display order (position) of the column on the board',
    example: 0,
    type: 'integer',
    minimum: 0,
  })
  @IsNotEmpty({ message: 'Column order cannot be empty' })
  @IsInt({ message: 'Column title should be an integer' })
  order: number;

  @ApiProperty({
    description: 'The unique identifier (UUID) of the user who owns this column',
    example: '8b4d1c3a-9e2f-4a5b-6c7d-8e9f0a1b2c3d',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'User id parameter cannot be empty' })
  @IsUUID(undefined, { message: 'User id parameter should be a UUID' })
  userId: string;
}
