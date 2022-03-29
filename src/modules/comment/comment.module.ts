import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from '../article/article.module';
import { UserModule } from '../user/user.module';
import { CommentController } from './comment.controller';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UserModule, ArticleModule],
  exports: [CommentService],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
