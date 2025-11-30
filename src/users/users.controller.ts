import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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

@Controller('users')
export class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly mapper: UserMapper,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<ResponseUserDto> {
    const user = this.mapper.toEntity(dto);
    return this.mapper.toDto(await this.service.create(user));
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<ResponseUserDto[]> {
    return (await this.service.findAll()).map((u) => this.mapper.toDto(u));
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-email')
  async findByEmail(@Query('email') email: string): Promise<ResponseUserDto> {
    return this.mapper.toDto(await this.service.findByEmail(email));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseUserDto> {
    return this.mapper.toDto(await this.service.findOne(id));
  }

  @UseGuards(JwtAuthGuard, UserOwnershipGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const user = Object.assign(new User(), dto) as Partial<User>;
    return this.mapper.toDto(await this.service.update(id, user));
  }

  @UseGuards(JwtAuthGuard, UserOwnershipGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
