import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Card } from '../../card/entities/card.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  order: number;

  @ManyToOne(() => User, (user) => user.columns)
  user: User;

  @ManyToOne(() => Card, (card) => card.comments)
  card: Card;
}
