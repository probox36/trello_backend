import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async getToken(dto: LoginDto): Promise<string> {
    const result = await this.checkCredentials(dto);
    if (!result.passwordMatches) {
      throw new UnauthorizedException('Wrong email or password');
    }
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
