import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ColumnModule } from './column/column.module';
import { CommentModule } from './comment/comment.module';
import { CardModule } from './card/card.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', // Читаем тип БД
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,

      entities: [__dirname + '/**/*.entity{.ts,.js}'],

      // В режиме разработки: автоматически создавать схему (не для production!)
      synchronize: true,
    }),
    ColumnModule,
    CommentModule,
    CardModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
