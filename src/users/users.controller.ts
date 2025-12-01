import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapper } from './mapper/user.mapper';
import { User } from './entities/user.entity';
import { ResponseUserDto } from './dto/response-user.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth-guard.service';
import { UserOwnershipGuard } from './guards/user.ownership.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('User Management')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly service: UsersService,
    private readonly mapper: UserMapper,
  ) {}

  @ApiOperation({ summary: 'Register a new user account' })
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration data (email and password).',
  })
  @ApiCreatedResponse({
    description: 'The user account was successfully created.',
    type: ResponseUserDto,
  })
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<ResponseUserDto> {
    this.logger.log(
      `Handling create request with data: ${JSON.stringify({ ...dto, password: '****' })}`,
    );
    const user = this.mapper.toEntity(dto);
    return this.mapper.toDto(await this.service.create(user));
  }

  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({
    description:
      'Unauthorized access. Authentication token is missing or invalid.',
  })
  @ApiOperation({ summary: 'Retrieve a list of all users' })
  @ApiOkResponse({
    description: 'Returns a list of all users.',
    type: ResponseUserDto,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<ResponseUserDto[]> {
    this.logger.log('Handling findAll request');
    return (await this.service.findAll()).map((u) => this.mapper.toDto(u));
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Find a single user by email address' })
  @ApiQuery({
    name: 'email',
    description: 'The email address to search for.',
    example: 'test@example.com',
  })
  @ApiOkResponse({
    description: 'Returns the user found by email.',
    type: ResponseUserDto,
  })
  @ApiNotFoundResponse({
    description: 'Not Found. User with the given email does not exist.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('by-email')
  async findByEmail(@Query('email') email: string): Promise<ResponseUserDto> {
    this.logger.log(`Handling findByEmail request for email: ${email}`);
    return this.mapper.toDto(await this.service.findByEmail(email));
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Retrieve a single user by ID' })
  @ApiOkResponse({
    description: 'Returns the requested user.',
    type: ResponseUserDto,
  })
  @ApiNotFoundResponse({
    description: 'Not Found. User with the given ID does not exist.',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseUserDto> {
    this.logger.log(`Handling findOne request for id: ${id}`);
    return this.mapper.toDto(await this.service.findOne(id));
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update specific fields of a user by ID' })
  @ApiBody({
    type: UpdateUserDto,
    description:
      'A subset of user properties to update (all fields are optional).',
  })
  @ApiOkResponse({
    description: 'The user was successfully updated and returned.',
    type: ResponseUserDto,
  })
  @ApiNotFoundResponse({
    description: 'Not Found. User with the given ID does not exist.',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden. The authenticated user does not have ownership of this account.',
  })
  @UseGuards(JwtAuthGuard, UserOwnershipGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    this.logger.log(
      `Handling update request for id: ${id} with data: ${JSON.stringify({ ...dto, password: '****' })}`,
    );
    const user = Object.assign(new User(), dto) as Partial<User>;
    return this.mapper.toDto(await this.service.update(id, user));
  }

  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user account by ID' })
  @ApiNoContentResponse({
    description:
      'The user account was successfully deleted. No content returned.',
  })
  @ApiNotFoundResponse({
    description: 'Not Found. User with the given ID does not exist.',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden. The authenticated user does not have ownership of this account.',
  })
  @UseGuards(JwtAuthGuard, UserOwnershipGuard)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.logger.log(`Handling remove request for id: ${id}`);
    return this.service.remove(id);
  }
}
