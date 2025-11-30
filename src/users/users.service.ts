import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Encrypter } from '@utils/encrypter';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

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

  async findOne(
    id: string,
    relations?: FindOptionsRelations<User>,
  ): Promise<User> {
    const user = await this.repo.findOne({
      where: { id },
      relations: relations,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repo.findOneBy({ email: email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
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
      throw new NotFoundException(`User with ID ${id} not found for update`);
    }
    return this.repo.save(userToUpdate);
  }

  async remove(id: string): Promise<void> {
    const userToRemove = await this.findOne(id);
    await this.repo.remove(userToRemove);
  }
}
