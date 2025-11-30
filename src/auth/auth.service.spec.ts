import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

describe('AuthService (Integration)', () => {
  let module: TestingModule;
  let authService: AuthService;
  let userService: UsersService;
  let userRepository: Repository<User>;

  const TEST_EMAIL = 'test@example.com';
  const TEST_PASSWORD = 'SecurePassword123';
  const WRONG_PASSWORD = 'WrongPassword';

  const userDto: CreateUserDto = {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>('UserRepository');
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    await userRepository.query(
      'TRUNCATE TABLE users RESTART IDENTITY CASCADE;',
    );
  });

  let createdUser: User;

  beforeEach(async () => {
    createdUser = await userService.create(userDto as User);
    expect(createdUser).toBeDefined();
    expect(createdUser.password.length).toBeGreaterThan(20);
  });

  it('Сценарий 1: Пользователь с таким email не существует (Wrong Email)', async () => {
    const loginDto = {
      email: 'nonexistent@example.com',
      password: TEST_PASSWORD,
    };

    await expect(authService.getToken(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('Сценарий 2: Пользователь существует, но пароль неверный (Wrong Password)', async () => {
    const loginDto = { email: TEST_EMAIL, password: WRONG_PASSWORD };

    await expect(authService.getToken(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('Сценарий 3: Пользователь существует, и пароль верный (Success)', async () => {
    const loginDto = { email: TEST_EMAIL, password: TEST_PASSWORD };
    const token = await authService.getToken(loginDto);
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });
});
