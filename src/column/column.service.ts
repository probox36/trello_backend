import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrelloColumn } from './entities/column.entity';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

interface Error {
  message: string;
  code: string;
}

@Injectable()
export class ColumnService {
  private readonly logger = new Logger(ColumnService.name);

  constructor(
    @InjectRepository(TrelloColumn)
    private repo: Repository<TrelloColumn>,
  ) {}

  async create(column: TrelloColumn): Promise<TrelloColumn> {
    this.logger.log(`Creating column with data: ${JSON.stringify(column)}`);
    try {
      const newColumn = await this.repo.save(column);
      this.logger.log(
        `Successfully created column: ${JSON.stringify(newColumn)}`,
      );
      return newColumn;
    } catch (e) {
      const error = e as Error;
      this.logger.error(
        `Failed to create column. Error: ${error.message ?? 'No message'}`,
      );
      if (error?.code === '23503') {
        throw new BadRequestException(
          'One of the child entities does not exist',
        );
      }
      throw e;
    }
  }

  async findAll(): Promise<TrelloColumn[]> {
    this.logger.log('Finding all columns');
    const columns = await this.repo.find();
    this.logger.log(`Found ${columns.length} columns`);
    return columns;
  }

  async findOne(
    id: string,
    relations?: FindOptionsRelations<TrelloColumn>,
  ): Promise<TrelloColumn> {
    this.logger.log(`Finding column with id: ${id}`);
    const column = await this.repo.findOne({
      where: { id },
      relations: relations,
    });
    if (!column) {
      this.logger.warn(`Column with ID ${id} not found`);
      throw new NotFoundException(`Column with ID ${id} not found`);
    }
    this.logger.log(`Found column: ${JSON.stringify(column)}`);
    return column;
  }

  async update(
    id: string,
    column: Partial<TrelloColumn>,
  ): Promise<TrelloColumn> {
    this.logger.log(
      `Updating column with id: ${id} with data: ${JSON.stringify(column)}`,
    );
    const columnToUpdate = await this.repo.preload({
      ...column,
      id: id,
    });
    if (!columnToUpdate) {
      this.logger.warn(`Column with ID ${id} not found for update`);
      throw new NotFoundException(`Column with ID ${id} not found for update`);
    }
    const updatedColumn = await this.repo.save(columnToUpdate);
    this.logger.log(
      `Successfully updated column: ${JSON.stringify(updatedColumn)}`,
    );
    return updatedColumn;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing column with id: ${id}`);
    const columnToRemove = await this.findOne(id);
    await this.repo.remove(columnToRemove);
    this.logger.log(`Successfully removed column with id: ${id}`);
  }
}
