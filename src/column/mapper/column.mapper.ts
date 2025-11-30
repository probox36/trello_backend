import { Column } from '../entities/column.entity';
import { Injectable } from '@nestjs/common';
import { CreateColumnDto } from '../dto/create-column.dto';
import { User } from '../../users/entities/user.entity';
import { ResponseColumnDto } from '../dto/response-column.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ColumnMapper {
  toEntity(dto: CreateColumnDto): Column {
    return {
      ...dto,
      id: undefined,
      cards: [],
      user: { id: dto.userId } as User,
    };
  }

  toDto(column: Column): ResponseColumnDto {
    return plainToInstance(ResponseColumnDto, column, {
      excludeExtraneousValues: true,
    });
  }
}
