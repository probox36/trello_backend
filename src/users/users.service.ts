import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Encrypter } from '@utils/encrypter';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    this.logger.log(`Creating user with email: ${user.email}`);
    user.password &&= await Encrypter.hash(user.password);
    const newUser = await this.repo.save(user);
    this.logger.log(`Successfully created user: ${JSON.stringify(newUser)}`);
    return newUser;
  }

  findAll(): Promise<User[]> {
    this.logger.log('Finding all users');
    return this.repo.find();
  }

  async findOne(
    id: string,
    relations?: FindOptionsRelations<User>,
  ): Promise<User> {
    this.logger.log(`Finding user with id: ${id}`);
    const user = await this.repo.findOne({
      where: { id },
      relations: relations,
    });
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.log(`Found user: ${JSON.stringify(user)}`);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    this.logger.log(`Finding user with email: ${email}`);
    const user = await this.repo.findOneBy({ email: email });
    if (!user) {
      this.logger.warn(`User with email ${email} not found`);
      throw new NotFoundException(`User with email ${email} not found`);
    }
    this.logger.log(`Found user: ${JSON.stringify(user)}`);
    return user;
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    this.logger.log(
      `Updating user with id: ${id} with data: ${JSON.stringify({ ...user, password: '****' })}`,
    );
    user.password &&= await Encrypter.hash(user.password);

    const userToUpdate = await this.repo.preload({
      ...user,
      id: id,
    });
    if (!userToUpdate) {
      this.logger.warn(`User with ID ${id} not found for update`);
      throw new NotFoundException(`User with ID ${id} not found for update`);
    }
    const updatedUser = await this.repo.save(userToUpdate);
    this.logger.log(
      `Successfully updated user: ${JSON.stringify(updatedUser)}`,
    );
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing user with id: ${id}`);
    const userToRemove = await this.findOne(id);
    await this.repo.remove(userToRemove);
    this.logger.log(`Successfully removed user with id: ${id}`);
  }
}
