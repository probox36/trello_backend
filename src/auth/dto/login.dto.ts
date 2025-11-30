import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail(undefined, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
