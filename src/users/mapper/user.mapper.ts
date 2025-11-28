import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ResponseUserDto } from '../dto/response-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserMapper {
  toEntity(dto: CreateUserDto): User {
    return {
      ...dto,
      columns: [],
      comments: [],
    };
  }

  toDto(user: User): ResponseUserDto {
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
