import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserMapper } from './mapper/user.mapper';
import { UserOwnershipGuard } from './guards/user.ownership.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, UserMapper, UserOwnershipGuard],
})
export class UsersModule {}
