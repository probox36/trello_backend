import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Encrypter } from '@utils/encrypter';
import { UsersService } from '../users/users.service';

interface CredCheckResult {
  userId: string;
  passwordMatches: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private generator: JwtService,
    private service: UsersService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async getToken(dto: LoginDto): Promise<string> {
    this.logger.log(`Processing token acquisition request for ${dto.email}`);
    const result = await this.checkCredentials(dto);
    if (!result.passwordMatches) {
      this.logger.log(
        `Credentials check failed for ${dto.email}. Cancelling token generation`,
      );
      throw new UnauthorizedException('Wrong email or password');
    }
    this.logger.log(
      `Credentials check succeeded for ${dto.email}. Providing token`,
    );
    const payload = { email: dto.email, id: result.userId };
    return this.generator.sign(payload);
  }

  async checkCredentials(dto: LoginDto): Promise<CredCheckResult> {
    const user = await this.service.findByEmail(dto.email).catch(() => null);
    const matches =
      user && (await Encrypter.comparePassword(dto.password, user.password));
    return {
      userId: user?.id ?? undefined,
      passwordMatches: matches ?? false,
    } as CredCheckResult;
  }
}
