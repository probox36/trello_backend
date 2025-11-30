import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail(undefined, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(10, { message: 'Password must be at least 10 characters long' })
  password: string;
}
