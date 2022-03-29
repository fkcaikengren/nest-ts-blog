import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from '../article/article.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';

@Entity('comments')
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'text' })
  content: string; //评论内容

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  pass: boolean; //是否过审

  @ApiProperty()
  @Column({ default: 0 })
  parentId: number; //父评论 id

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ApiProperty({ type: () => Article })
  @ManyToOne(() => Article, (article) => article.comments)
  article: Article;
}
