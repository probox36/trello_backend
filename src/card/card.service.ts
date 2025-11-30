import { Injectable, NotFoundException } from '@nestjs/common';
import { Card } from './entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private repo: Repository<Card>,
  ) {}
  async create(card: Card): Promise<Card> {
    return this.repo.save(card);
  }

  async findAll(): Promise<Card[]> {
    return this.repo.find();
  }

  async findOne(
    id: string,
    relations?: FindOptionsRelations<Card>,
  ): Promise<Card> {
    const card = await this.repo.findOne({
      where: { id },
      relations: relations,
    });
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    return card;
  }

  async update(id: string, card: Partial<Card>): Promise<Card> {
    const cardToUpdate = await this.repo.preload({
      id: id,
      ...card,
    });
    if (!cardToUpdate) {
      throw new NotFoundException(`Card with ID ${id} not found for update`);
    }
    return this.repo.save(cardToUpdate);
  }

  async remove(id: string): Promise<void> {
    const cardToRemove = await this.findOne(id);
    await this.repo.remove(cardToRemove);
  }
}
