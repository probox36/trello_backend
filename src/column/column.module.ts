import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnMapper } from './mapper/column.mapper';
import { TrelloColumn } from './entities/column.entity';
import { ColumnOwnershipGuard } from './guards/column.ownership.guard';

@Module({
  imports: [TypeOrmModule.forFeature([TrelloColumn])],
  controllers: [ColumnController],
  providers: [ColumnService, ColumnMapper, ColumnOwnershipGuard],
  exports: [ColumnService],
})
export class ColumnModule {}
