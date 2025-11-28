import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ColumnModule } from './column/column.module';
import { CommentModule } from './comment/comment.module';
import { CardModule } from './card/card.module';
import { typeOrmConfig } from '../db/datasource';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ColumnModule,
    CommentModule,
    CardModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
