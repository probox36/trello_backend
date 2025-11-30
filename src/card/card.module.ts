import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { CardMapper } from './mapper/card.mapper';
import { ColumnModule } from '../column/column.module';
import { CardOwnershipGuard } from './guards/card.ownership.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), ColumnModule],
  controllers: [CardController],
  providers: [CardService, CardMapper, CardOwnershipGuard],
})
export class CardModule {}
