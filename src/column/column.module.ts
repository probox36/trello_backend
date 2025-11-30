import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Column } from 'typeorm';
import { ColumnMapper } from './mapper/column.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Column])],
  controllers: [ColumnController],
  providers: [ColumnService, ColumnMapper],
})
export class ColumnModule {}
