import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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

@ApiTags('Card Management')
@ApiBearerAuth('access-token') // Обозначает, что весь контроллер требует JWT
@ApiUnauthorizedResponse({
  description:
    'Unauthorized access. Authentication token is missing or invalid.',
})
@Controller('card')
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(
    private readonly service: CardService,
    private readonly mapper: CardMapper,
  ) {}

  @ApiOperation({ summary: 'Create a new card and assign it to a column' })
  @ApiBody({
    type: CreateCardDto,
    description:
      'Card creation data including title, content, order, and column ID.',
  })
  @ApiCreatedResponse({
    description: 'The card was successfully created and returned.',
    type: ResponseCardDto,
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden. The authenticated user does not have permission for the target column.',
  })
  @UseGuards(CardOwnershipGuard)
  @Post()
  async create(@Body() dto: CreateCardDto): Promise<ResponseCardDto> {
    const card = this.mapper.toEntity(dto);
    return this.mapper.toDto(await this.service.create(card));
  }

  @ApiOperation({
    summary: 'Retrieve a list of all cards visible to the authenticated user',
  })
  @ApiOkResponse({
    description: 'Returns a list of cards.',
    type: ResponseCardDto,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<ResponseCardDto[]> {
    return (await this.service.findAll()).map((c) => this.mapper.toDto(c));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single card by its ID' })
  @ApiOkResponse({
    description: 'Returns the requested card.',
    type: ResponseCardDto,
  })
  @ApiNotFoundResponse({
    description: 'Not Found. Card with the given ID does not exist.',
  })
  async findOne(@Param('id') id: string): Promise<ResponseCardDto> {
    return this.mapper.toDto(await this.service.findOne(id));
  }

  @UseGuards(CardOwnershipGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update specific fields of a card by ID' })
  @ApiBody({
    type: UpdateCardDto,
    description:
      'A subset of card properties to update (all fields are optional).',
  })
  @ApiOkResponse({
    description: 'The card was successfully updated and returned.',
    type: ResponseCardDto,
  })
  @ApiNotFoundResponse({
    description: 'Not Found. Card with the given ID does not exist.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. The authenticated user does not own this card.',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCardDto,
  ): Promise<ResponseCardDto> {
    const card = Object.assign(new Card(), dto) as Partial<Card>;
    return this.mapper.toDto(await this.service.update(id, card));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(CardOwnershipGuard)
  @ApiOperation({ summary: 'Delete a card by ID' })
  @ApiNoContentResponse({
    description: 'The card was successfully deleted. No content returned.',
  })
  @ApiNotFoundResponse({
    description: 'Not Found. Card with the given ID does not exist.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. The authenticated user does not own this card.',
  })
  @UseGuards(CardOwnershipGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
