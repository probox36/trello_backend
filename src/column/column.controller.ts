import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ColumnMapper } from './mapper/column.mapper';
import { ResponseColumnDto } from './dto/response-column.dto';
import { TrelloColumn } from './entities/column.entity';

@Controller('column')
export class ColumnController {
  constructor(
    private readonly service: ColumnService,
    private readonly mapper: ColumnMapper,
  ) {}

  @Post()
  async create(@Body() dto: CreateColumnDto): Promise<ResponseColumnDto> {
    const column = this.mapper.toEntity(dto);
    return this.mapper.toDto(await this.service.create(column));
  }

  @Get()
  async findAll(): Promise<ResponseColumnDto[]> {
    return (await this.service.findAll()).map((c) => this.mapper.toDto(c));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseColumnDto> {
    return this.mapper.toDto(await this.service.findOne(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateColumnDto,
  ): Promise<ResponseColumnDto> {
    const column = Object.assign(
      new TrelloColumn(),
      dto,
    ) as Partial<TrelloColumn>;
    return this.mapper.toDto(await this.service.update(id, column));
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
