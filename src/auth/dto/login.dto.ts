import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User login email address',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail(undefined, { message: 'Invalid email' })
  email: string;

  @ApiProperty({
    description: 'User password',
  })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
