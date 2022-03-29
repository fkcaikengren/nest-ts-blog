import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './modules/category/category.module';
import { ArticleModule } from './modules/article/article.module';
import { Article } from './modules/article/article.entity';
import { Category } from './modules/category/category.entity';
import { TagModule } from './modules/tag/tag.module';
import { CommentModule } from './modules/comment/comment.module';
import { UserModule } from './modules/user/user.module';
import { Tag } from './modules/tag/tag.entity';
import { Comment } from './modules/comment/comment.entity';
import { User } from './modules/user/user.entity';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '111.229.143.202',
      port: 3306,
      username: 'admin',
      password: '2016fkckr.T@g',
      database: 'blog',
      entities: [Category, Article, Tag, Comment, User],
      synchronize: true,
    }),
    ArticleModule,
    CategoryModule,
    TagModule,
    CommentModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('articles');
  }
}
