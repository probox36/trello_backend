import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ResponseCardDto } from './dto/response-card.dto';
import { CardMapper } from './mapper/card.mapper';
import { Card } from './entities/card.entity';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth-guard.service';
import { CardOwnershipGuard } from './guards/card.ownership.guard';

@Controller('card')
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(
    private readonly service: CardService,
    private readonly mapper: CardMapper,
  ) {}

  @UseGuards(CardOwnershipGuard)
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

  @UseGuards(CardOwnershipGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCardDto,
  ): Promise<ResponseCardDto> {
    const card = Object.assign(new Card(), dto) as Partial<Card>;
    return this.mapper.toDto(await this.service.update(id, card));
  }

  @UseGuards(CardOwnershipGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
