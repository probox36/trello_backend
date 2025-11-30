import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentMapper } from './mapper/comment.mapper';
import { CommentOwnershipGuard } from './guards/comment.ownership.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  controllers: [CommentController],
  providers: [CommentService, CommentMapper, CommentOwnershipGuard],
})
export class CommentModule {}
