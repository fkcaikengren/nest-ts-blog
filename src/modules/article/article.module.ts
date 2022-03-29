import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { CategoryModule } from '../category/category.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), CategoryModule, TagModule],
  exports: [ArticleService],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
