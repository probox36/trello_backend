import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapper } from './mapper/user.mapper';
import { User } from './entities/user.entity';
import { ResponseUserDto } from './dto/response-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mapper: UserMapper,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<ResponseUserDto> {
    const user = this.mapper.toEntity(dto);
    return this.mapper.toDto(await this.usersService.create(user));
  }

  @Get()
  async findAll(): Promise<ResponseUserDto[]> {
    return (await this.usersService.findAll()).map((u) => this.mapper.toDto(u));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseUserDto> {
    return this.mapper.toDto(await this.usersService.findOne(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const user = Object.assign(new User(), dto) as Partial<User>;
    return this.mapper.toDto(await this.usersService.update(id, user));
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
