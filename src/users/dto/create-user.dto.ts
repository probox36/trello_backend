import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The unique email address of the new user',
    example: 'new.user@example.com',
    format: 'email',
  })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail(undefined, { message: 'Invalid email' })
  email: string;

  @ApiProperty({
    description: 'The secure password for the user account',
    example: 'S3cureP@sswOrd!',
    minLength: 10,
  })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(10, { message: 'Password must be at least 10 characters long' })
  password: string;
}
