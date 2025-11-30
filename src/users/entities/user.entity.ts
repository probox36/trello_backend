import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TrelloColumn as TrelloColumn } from '../../column/entities/column.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => TrelloColumn, (column) => column.user)
  columns: TrelloColumn[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
