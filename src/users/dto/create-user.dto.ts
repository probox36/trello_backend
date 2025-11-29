import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsStrongPassword(
    { minLength: 10, minNumbers: 1, minSymbols: 1 },
    {
      message:
        'Password should be at least 10 characters with 1+ special characters and 1+ digits',
    },
  )
  password: string;
}
