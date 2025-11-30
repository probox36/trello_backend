import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Card } from '../../card/entities/card.entity';

@Entity('columns')
export class TrelloColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column()
  title: string;

  @Column()
  order: number;

  @ManyToOne(() => User, (user) => user.columns)
  user: User;

  @OneToMany(() => Card, (card) => card.column)
  cards: Card[];
}
