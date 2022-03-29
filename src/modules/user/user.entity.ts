import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../comment/comment.entity';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  nickname: string;

  @ApiProperty()
  @Column({ default: null })
  avatar: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column({ default: null })
  phone: string;

  // @ApiProperty()
  @Column({ select: false })
  password: string;

  @ApiProperty()
  @Column('simple-enum', { enum: ['admin', 'visitor'], default: 'visitor' })
  role: string;

  @ApiProperty()
  @Column('simple-enum', { enum: ['active', 'locked'], default: 'active' })
  status: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @BeforeInsert()
  encrypt() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  // @BeforeInsert()
  // randomName() {
  //   this.nickname = Math.random().toString(36).substr(2, 6);
  // }
}
