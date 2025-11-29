import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Encrypter } from './utils/encrypter';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    user.password &&= await Encrypter.hash(user.password);
    return this.repo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден.`);
    }
    return user;
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    user.password &&= await Encrypter.hash(user.password);

    const userToUpdate = await this.repo.preload({
      id: id,
      ...user,
    });
    if (!userToUpdate) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден.`);
    }
    return this.repo.save(userToUpdate);
  }

  async remove(id: string): Promise<void> {
    const userToRemove = await this.findOne(id);
    await this.repo.remove(userToRemove);
  }
}
