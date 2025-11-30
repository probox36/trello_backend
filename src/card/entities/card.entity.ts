import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { TrelloColumn as TrelloColumn } from '../../column/entities/column.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  order: number;

  @ManyToOne(() => TrelloColumn, (column) => column.cards)
  column: TrelloColumn;

  @OneToMany(() => Comment, (comment) => comment.card)
  comments: Comment[];
}
