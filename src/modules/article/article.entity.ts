import { Category } from './../category/category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from '../tag/tag.entity';
import { Comment } from '../comment/comment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('articles')
export class Article {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  cover: string; //封面

  @ApiProperty()
  @Column()
  summary: string; //摘要

  @ApiProperty()
  @Column({ type: 'mediumtext' })
  content: string; //原始内容

  @ApiProperty()
  @Column({ type: 'mediumtext' })
  html: string; // 格式化内容，自动生成

  @ApiProperty()
  @Column({ type: 'mediumtext' })
  toc: string; // 格式化内容索引，自动生成

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  likes: number; //喜欢数

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  views: number; //浏览量

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isRecommended: boolean; //是否推荐

  @ApiProperty()
  @Column('simple-enum', { enum: ['draft', 'publish'] })
  status: string; //文章状态

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => Category })
  @ManyToOne(() => Category, (category) => category.articles)
  category: Category;

  @ApiProperty({ type: () => [Tag] })
  @ManyToMany(() => Tag, (tag) => tag.articles /* { cascade: true }*/)
  @JoinTable() //产生中间表
  tags: Tag[];

  @ApiProperty({ type: () => [Comment] })
  @ManyToOne(() => Comment, (comment) => comment.article)
  comments: Comment[];
}
/*
 cascade:true
 在建表的时候会设置外键级联，foreign key (tagId) references a(id) on delete cascade.
 tag(一) -- article(多)，当删除‘一’的一方，会级联删除多的一方。
*/
