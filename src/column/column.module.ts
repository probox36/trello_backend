import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Column } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Column])],
  controllers: [ColumnController],
  providers: [ColumnService],
})
export class ColumnModule {}
