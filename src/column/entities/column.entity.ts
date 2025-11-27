import {
  Entity,
  Column as OrmColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Card } from '../../card/entities/card.entity';

@Entity('columns')
export class Column {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OrmColumn()
  title: string;

  @OrmColumn()
  order: number;

  @ManyToOne(() => User, (user) => user.columns)
  user: User;

  @OneToMany(() => Card, (card) => card.column)
  cards: Card[];
}
