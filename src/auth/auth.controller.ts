import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

class LoginResponseDto {
  message: string;
  token: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly service: AuthService) {}

  @ApiOperation({ summary: 'Authenticate a user and issue an access token' })
  @ApiBody({
    type: LoginDto,
    description:
      'User credentials (email and password) required to perform login.',
  })
  @ApiOkResponse({
    description:
      'Successful authentication. Returns an access token and a confirmation message.',
    type: LoginResponseDto,
  })
  @Post()
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    this.logger.log(`Handling login request for email: ${dto.email}`);
    return {
      message:
        'You have been successfully logged in. Use your JWT to make API calls',
      token: await this.service.getToken(dto),
    };
  }
}
