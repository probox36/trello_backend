import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrelloColumn } from './entities/column.entity';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(TrelloColumn)
    private repo: Repository<TrelloColumn>,
  ) {}

  async create(column: TrelloColumn): Promise<TrelloColumn> {
    try {
      return await this.repo.save(column);
    } catch (error) {
      if ((error as { code: string })?.code === '23503') {
        throw new BadRequestException(
          'One of the child entities does not exist',
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<TrelloColumn[]> {
    return this.repo.find();
  }

  async findOne(
    id: string,
    relations?: FindOptionsRelations<TrelloColumn>,
  ): Promise<TrelloColumn> {
    const column = await this.repo.findOne({
      where: { id },
      relations: relations,
    });
    if (!column) {
      throw new NotFoundException(`Column with ID ${id} not found`);
    }
    return column;
  }

  async update(
    id: string,
    column: Partial<TrelloColumn>,
  ): Promise<TrelloColumn> {
    const columnToUpdate = await this.repo.preload({
      ...column,
      id: id,
    });
    if (!columnToUpdate) {
      throw new NotFoundException(`Column with ID ${id} not found for update`);
    }
    return this.repo.save(columnToUpdate);
  }

  async remove(id: string): Promise<void> {
    const columnToRemove = await this.findOne(id);
    await this.repo.remove(columnToRemove);
  }
}
