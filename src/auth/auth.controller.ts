import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

interface LoginResponseDto {
  message: string;
  token: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post()
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return {
      message:
        'You have been successfully logged in. Use your JWT to make API calls',
      token: await this.service.getToken(dto),
    };
  }
}
