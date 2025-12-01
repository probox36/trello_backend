import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Card } from './entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

interface Error {
  message: string;
  code: string;
}

@Injectable()
export class CardService {
  private readonly logger = new Logger(CardService.name);

  constructor(
    @InjectRepository(Card)
    private repo: Repository<Card>,
  ) {}

  async create(card: Card): Promise<Card> {
    this.logger.log(`Creating card with data: ${JSON.stringify(card)}`);
    try {
      const newCard = await this.repo.save(card);
      this.logger.log(`Successfully created card: ${JSON.stringify(newCard)}`);
      return newCard;
    } catch (e) {
      const error = e as Error;
      this.logger.error(
        `Failed to create card. Error: ${error.message ?? 'No message'}`,
      );
      if (error?.code === '23503') {
        throw new BadRequestException(
          'One of the child entities does not exist',
        );
      }
      throw e;
    }
  }

  async findAll(): Promise<Card[]> {
    this.logger.log('Finding all cards');
    const cards = await this.repo.find();
    this.logger.log(`Found ${cards.length} cards`);
    return cards;
  }

  async findOne(
    id: string,
    relations?: FindOptionsRelations<Card>,
  ): Promise<Card> {
    this.logger.log(`Finding card with id: ${id}`);
    const card = await this.repo.findOne({
      where: { id },
      relations: relations,
    });
    if (!card) {
      this.logger.warn(`Card with ID ${id} not found`);
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    this.logger.log(`Found card: ${JSON.stringify(card)}`);
    return card;
  }

  async update(id: string, card: Partial<Card>): Promise<Card> {
    this.logger.log(
      `Updating card with id: ${id} with data: ${JSON.stringify(card)}`,
    );
    const cardToUpdate = await this.repo.preload({
      ...card,
      id: id,
    });
    if (!cardToUpdate) {
      this.logger.warn(`Card with ID ${id} not found for update`);
      throw new NotFoundException(`Card with ID ${id} not found for update`);
    }
    const updatedCard = await this.repo.save(cardToUpdate);
    this.logger.log(
      `Successfully updated card: ${JSON.stringify(updatedCard)}`,
    );
    return updatedCard;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing card with id: ${id}`);
    const cardToRemove = await this.findOne(id);
    await this.repo.remove(cardToRemove);
    this.logger.log(`Successfully removed card with id: ${id}`);
  }
}
