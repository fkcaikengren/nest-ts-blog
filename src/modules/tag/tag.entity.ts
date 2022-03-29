import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Article } from '../article/article.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tags')
export class Tag {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => Article })
  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[];
}
