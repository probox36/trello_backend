import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ColumnMapper } from './mapper/column.mapper';
import { ResponseColumnDto } from './dto/response-column.dto';
import { TrelloColumn } from './entities/column.entity';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth-guard.service';
import { ColumnOwnershipGuard } from './guards/column.ownership.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Column Management')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description:
    'Unauthorized access. Authentication token is missing or invalid.',
})
@Controller('column')
@UseGuards(JwtAuthGuard)
export class ColumnController {
  constructor(
    private readonly service: ColumnService,
    private readonly mapper: ColumnMapper,
  ) {}

  @UseGuards(ColumnOwnershipGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new column for the authenticated user' })
  @ApiBody({
    type: CreateColumnDto,
    description: 'Column creation data including title, order, and user ID.',
  })
  @ApiCreatedResponse({
    description: 'The column was successfully created and returned.',
    type: ResponseColumnDto,
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden. The authenticated user is trying to create a column for a different user.',
  })
  async create(@Body() dto: CreateColumnDto): Promise<ResponseColumnDto> {
    const column = this.mapper.toEntity(dto);
    return this.mapper.toDto(await this.service.create(column));
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all columns belonging to the authenticated user',
  })
  @ApiOkResponse({
    description: 'Returns a list of columns.',
    type: ResponseColumnDto,
    isArray: true,
  })
  async findAll(): Promise<ResponseColumnDto[]> {
    return (await this.service.findAll()).map((c) => this.mapper.toDto(c));
  }

  @ApiOperation({ summary: 'Retrieve a single column by its ID' })
  @ApiOkResponse({
    description: 'Returns the requested column.',
    type: ResponseColumnDto,
  })
  @ApiNotFoundResponse({
    description: 'Not Found. Column with the given ID does not exist.',
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseColumnDto> {
    return this.mapper.toDto(await this.service.findOne(id));
  }

  @UseGuards(ColumnOwnershipGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update specific fields of a column by ID' })
  @ApiBody({
    type: UpdateColumnDto,
    description:
      'A subset of column properties to update (all fields are optional).',
  })
  @ApiOkResponse({
    description: 'The column was successfully updated and returned.',
    type: ResponseColumnDto,
  })
  @ApiNotFoundResponse({
    description: 'Not Found. Column with the given ID does not exist.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. The authenticated user does not own this column.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateColumnDto,
  ): Promise<ResponseColumnDto> {
    const column = Object.assign(
      new TrelloColumn(),
      dto,
    ) as Partial<TrelloColumn>;
    return this.mapper.toDto(await this.service.update(id, column));
  }

  @UseGuards(ColumnOwnershipGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a column by ID' })
  @ApiNoContentResponse({
    description: 'The column was successfully deleted. No content returned.',
  })
  @ApiNotFoundResponse({
    description: 'Not Found. Column with the given ID does not exist.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. The authenticated user does not own this column.',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.service.remove(id);
  }
}
