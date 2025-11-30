import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({
    description: 'The title of the new card',
    example: 'Task: Implement Swagger documentation',
    minLength: 1,
  })
  @IsNotEmpty({ message: 'Card title cannot be empty' })
  @IsString({ message: 'Card title should be a string' })
  title: string;

  @ApiProperty({
    description: 'The detailed content or description of the card',
    example:
      'Define DTOs and Controllers, apply @ApiProperty and other decorators.',
    minLength: 1,
  })
  @IsNotEmpty({ message: 'Card content cannot be empty' })
  @IsString({ message: 'Card content should be a string' })
  content: string;

  @ApiProperty({
    description:
      'The position (display order) of the card within its column (must be non-negative)',
    example: 0,
    minimum: 0,
    type: 'integer',
  })
  @IsNotEmpty({ message: 'Card order cannot be empty' })
  @IsInt({ message: 'Card order should be an integer' })
  @Min(0, { message: 'Order should be >= 0' })
  order: number;

  @ApiProperty({
    description:
      'The unique identifier (UUID) of the column to which the card belongs',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'Column id parameter cannot be empty' })
  @IsUUID(undefined, { message: 'Column id parameter should be a UUID' })
  columnId: string;
}
