import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentMapper } from './mapper/comment.mapper';
import { ResponseCommentDto } from './dto/response-comment.dto';
import { Comment } from './entities/comment.entity';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth-guard.service';
import { CommentOwnershipGuard } from './guards/comment.ownership.guard';
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

@ApiTags('Comment Management')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description:
    'Unauthorized access. Authentication token is missing or invalid.',
})
@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
  private readonly logger = new Logger(CommentController.name);

  constructor(
    private readonly service: CommentService,
    private readonly mapper: CommentMapper,
  ) {}

  @ApiOperation({
    summary: 'Create a new comment and attach it to a specific card',
  })
  @ApiBody({
    type: CreateCommentDto,
    description:
      'Comment creation data including content, order, user ID, and card ID.',
  })
  @ApiCreatedResponse({
    description: 'The comment was successfully created and returned.',
    type: ResponseCommentDto,
  })
  @Post()
  async create(@Body() dto: CreateCommentDto): Promise<ResponseCommentDto> {
    this.logger.log(
      `Handling create request with data: ${JSON.stringify(dto)}`,
    );
    const comment = this.mapper.toEntity(dto);
    return this.mapper.toDto(await this.service.create(comment));
  }

  @ApiOperation({
    summary:
      'Retrieve a list of all comments visible to the authenticated user',
  })
  @ApiOkResponse({
    description: 'Returns a list of comments.',
    type: ResponseCommentDto,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<ResponseCommentDto[]> {
    this.logger.log('Handling findAll request');
    return (await this.service.findAll()).map((c) => this.mapper.toDto(c));
  }

  @ApiOperation({ summary: 'Retrieve a single comment by its ID' })
  @ApiOkResponse({
    description: 'Returns the requested comment.',
    type: ResponseCommentDto,
  })
  @ApiNotFoundResponse({
    description: 'Not Found. Comment with the given ID does not exist.',
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseCommentDto> {
    this.logger.log(`Handling findOne request for id: ${id}`);
    return this.mapper.toDto(await this.service.findOne(id));
  }

  @ApiOperation({ summary: 'Update specific fields of a comment by ID' })
  @ApiBody({
    type: UpdateCommentDto,
    description:
      'A subset of comment properties to update (all fields are optional).',
  })
  @ApiOkResponse({
    description: 'The comment was successfully updated and returned.',
    type: ResponseCommentDto,
  })
  @ApiNotFoundResponse({
    description: 'Not Found. Comment with the given ID does not exist.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. The authenticated user does not own this comment.',
  })
  @UseGuards(CommentOwnershipGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCommentDto,
  ): Promise<ResponseCommentDto> {
    this.logger.log(
      `Handling update request for id: ${id} with data: ${JSON.stringify(dto)}`,
    );
    const comment = Object.assign(new Comment(), dto) as Partial<Comment>;
    return this.mapper.toDto(await this.service.update(id, comment));
  }

  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiNoContentResponse({
    description: 'The comment was successfully deleted. No content returned.',
  })
  @ApiNotFoundResponse({
    description: 'Not Found. Comment with the given ID does not exist.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. The authenticated user does not own this comment.',
  })
  @UseGuards(CommentOwnershipGuard)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.logger.log(`Handling remove request for id: ${id}`);
    return this.service.remove(id);
  }
}
