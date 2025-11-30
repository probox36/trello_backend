import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.repo.save(column);
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
      id: id,
      ...column,
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
