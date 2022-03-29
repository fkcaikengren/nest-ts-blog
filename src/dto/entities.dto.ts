import { User } from './../modules/user/user.entity';
import { Article } from '../modules/article/article.entity';
import { Comment } from '../modules/comment/comment.entity';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Category } from 'src/modules/category/category.entity';
import { Tag } from 'src/modules/tag/tag.entity';

export class UserDto extends OmitType(User, ['comments'] as const) {}
export class EmailRegisterUserDto {
  @ApiProperty()
  nickname: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  emailCode: string;
}

export class EmailLoginUserDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class AuthUserDto extends OmitType(User, [
  'comments',
  'password',
] as const) {
  @ApiProperty()
  accessToken: string;
}
export class CategoryDto extends OmitType(Category, ['articles'] as const) {}

export class TagDto extends OmitType(Tag, ['articles'] as const) {}

export class CommentDto extends OmitType(Comment, [
  'user',
  'article',
] as const) {}

export class CreateCommentDto extends OmitType(Comment, [
  'user',
  'article',
] as const) {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  articleId: number;
}

export class ListCommentDto extends OmitType(Comment, [
  'user',
  'article',
] as const) {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  articleId: number;
}

export class ArticleDto extends OmitType(Article, [
  'category',
  'tags',
  'comments',
] as const) {
  @ApiProperty({ type: () => CategoryDto })
  category: CategoryDto;
  @ApiProperty({ type: () => [TagDto] })
  tags: TagDto[];
  @ApiProperty({ type: () => [CommentDto] })
  comments?: CommentDto[];
}

export class CreateArticleDto extends OmitType(Article, [
  'category',
  'tags',
  'comments',
] as const) {
  @ApiProperty()
  categoryId: number;

  @ApiProperty({ type: () => [Number] })
  tagIds: number[];
}

export class ListArticleDto extends OmitType(Article, [
  'content',
  'category',
  'tags',
  'comments',
] as const) {
  @ApiProperty({ type: () => CategoryDto })
  category: CategoryDto;
  @ApiProperty({ type: () => [TagDto] })
  tags: TagDto[];
}
