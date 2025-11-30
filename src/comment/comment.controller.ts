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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentMapper } from './mapper/comment.mapper';
import { ResponseCommentDto } from './dto/response-comment.dto';
import { Comment } from './entities/comment.entity';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth-guard.service';
import { CommentOwnershipGuard } from './guards/comment.ownership.guard';

@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
  constructor(
    private readonly service: CommentService,
    private readonly mapper: CommentMapper,
  ) {}

  @UseGuards(CommentOwnershipGuard)
  @Post()
  async create(@Body() dto: CreateCommentDto): Promise<ResponseCommentDto> {
    const comment = this.mapper.toEntity(dto);
    return this.mapper.toDto(await this.service.create(comment));
  }

  @Get()
  async findAll(): Promise<ResponseCommentDto[]> {
    return (await this.service.findAll()).map((c) => this.mapper.toDto(c));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseCommentDto> {
    return this.mapper.toDto(await this.service.findOne(id));
  }

  @UseGuards(CommentOwnershipGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
  ): Promise<ResponseCommentDto> {
    const comment = Object.assign(new Comment(), dto) as Partial<Comment>;
    return this.mapper.toDto(await this.service.update(id, comment));
  }

  @UseGuards(CommentOwnershipGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
