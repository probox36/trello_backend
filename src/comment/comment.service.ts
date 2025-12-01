import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

interface Error {
  message: string;
  code: string;
}

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(
    @InjectRepository(Comment)
    private repo: Repository<Comment>,
  ) {}

  async create(comment: Comment): Promise<Comment> {
    this.logger.log(`Creating comment with data: ${JSON.stringify(comment)}`);
    try {
      const newComment = await this.repo.save(comment);
      this.logger.log(
        `Successfully created comment: ${JSON.stringify(newComment)}`,
      );
      return newComment;
    } catch (e) {
      const error = e as Error;
      this.logger.error(
        `Failed to create comment. Error: ${error.message ?? 'No message'}`,
      );
      if (error?.code === '23503') {
        throw new BadRequestException(
          'One of the child entities does not exist',
        );
      }
      throw e;
    }
  }

  async findAll(): Promise<Comment[]> {
    this.logger.log('Finding all comments');
    const comments = await this.repo.find();
    this.logger.log(`Found ${comments.length} comments`);
    return comments;
  }

  async findOne(
    id: string,
    relations?: FindOptionsRelations<Comment>,
  ): Promise<Comment> {
    this.logger.log(`Finding comment with id: ${id}`);
    const comment = await this.repo.findOne({
      where: { id },
      relations: relations,
    });
    if (!comment) {
      this.logger.warn(`Comment with ID ${id} not found`);
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    this.logger.log(`Found comment: ${JSON.stringify(comment)}`);
    return comment;
  }

  async update(id: string, comment: Partial<Comment>): Promise<Comment> {
    this.logger.log(
      `Updating comment with id: ${id} with data: ${JSON.stringify(comment)}`,
    );
    const commentToUpdate = await this.repo.preload({
      ...comment,
      id: id,
    });
    if (!commentToUpdate) {
      this.logger.warn(`Comment with ID ${id} not found for update`);
      throw new NotFoundException(`Comment with ID ${id} not found for update`);
    }
    const updatedComment = await this.repo.save(commentToUpdate);
    this.logger.log(
      `Successfully updated comment: ${JSON.stringify(updatedComment)}`,
    );
    return updatedComment;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing comment with id: ${id}`);
    const userToRemove = await this.findOne(id);
    await this.repo.remove(userToRemove);
    this.logger.log(`Successfully removed comment with id: ${id}`);
  }
}
