import { IsEmail, IsNotEmpty, IsStrongPassword, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({ minLength: 10, minNumbers: 1, minSymbols: 1 })
  password: string;
}
