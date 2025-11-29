import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Column } from './entities/column.entity';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(Column)
    private repo: Repository<Column>,
  ) {}

  async create(column: Column): Promise<Column> {
    return this.repo.save(column);
  }

  async findAll(): Promise<Column[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<Column> {
    const column = await this.repo.findOneBy({ id });
    if (!column) {
      throw new NotFoundException(`Column with ID ${id} not found`);
    }
    return column;
  }

  async update(id: string, column: Partial<Column>): Promise<Column> {
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
