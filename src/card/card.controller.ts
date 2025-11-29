import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ResponseCardDto } from './dto/response-card.dto';
import { CardMapper } from './mapper/card.mapper';
import { Card } from './entities/card.entity';

@Controller('card')
export class CardController {
  constructor(
    private readonly service: CardService,
    private readonly mapper: CardMapper,
  ) {}

  @Post()
  async create(@Body() dto: CreateCardDto): Promise<ResponseCardDto> {
    const card = this.mapper.toEntity(dto);
    return this.mapper.toDto(await this.service.create(card));
  }

  @Get()
  async findAll(): Promise<ResponseCardDto[]> {
    return (await this.service.findAll()).map((c) => this.mapper.toDto(c));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseCardDto> {
    return this.mapper.toDto(await this.service.findOne(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCardDto,
  ): Promise<ResponseCardDto> {
    const card = Object.assign(new Card(), dto) as Partial<Card>;
    return this.mapper.toDto(await this.service.update(id, card));
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
