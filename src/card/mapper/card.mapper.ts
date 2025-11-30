import { CreateCardDto } from '../dto/create-card.dto';
import { Card } from '../entities/card.entity';
import { TrelloColumn } from '../../column/entities/column.entity';
import { ResponseCardDto } from '../dto/response-card.dto';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CardMapper {
  toEntity(dto: CreateCardDto): Card {
    return {
      ...dto,
      id: undefined,
      comments: [],
      column: { id: dto.columnId } as TrelloColumn,
    };
  }

  toDto(card: Card): ResponseCardDto {
    return plainToInstance(ResponseCardDto, card, {
      excludeExtraneousValues: true,
    });
  }
}
