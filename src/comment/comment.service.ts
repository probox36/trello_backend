import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private repo: Repository<Comment>,
  ) {}

  async create(createCommentDto: Comment): Promise<Comment> {
    return await this.repo.save(createCommentDto);
  }

  async findAll(): Promise<Comment[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.repo.findOneBy({ id });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async update(id: string, comment: Partial<Comment>): Promise<Comment> {
    const commentToUpdate = await this.repo.preload({
      id: id,
      ...comment,
    });
    if (!commentToUpdate) {
      throw new NotFoundException(`Comment with ID ${id} not found for update`);
    }
    return this.repo.save(commentToUpdate);
  }

  async remove(id: string): Promise<void> {
    const userToRemove = await this.findOne(id);
    await this.repo.remove(userToRemove);
  }
}
