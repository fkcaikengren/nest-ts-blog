import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CommentDto,
  CreateCommentDto,
  ListCommentDto,
} from 'src/dto/entities.dto';
import { ArticleService } from './../article/article.service';
import { UserService } from './../user/user.service';
import { Comment } from './comment.entity';
import { PaginatedDto } from 'src/dto/paginated.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UserService,
    private readonly articleService: ArticleService,
  ) {}

  async create(comment: Partial<CreateCommentDto>): Promise<CommentDto> {
    const { userId, articleId, content } = comment;
    let errMsg: string;
    if (!userId) {
      errMsg = '参数缺少用户id';
    }
    if (!articleId) {
      errMsg = '参数缺少文章id';
    }
    if (!content) {
      errMsg = '评论内容不能为空';
    }
    if (errMsg) {
      throw new HttpException(errMsg, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const article = await this.articleService.findOneWithoutRelation(articleId);
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new HttpException(
        '关联用户未找到',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (!article) {
      throw new HttpException(
        '关联文章未找到',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const createdComment = this.commentRepository.create({
      ...comment,
      user,
      article,
    });
    const newComment = await this.commentRepository.save(createdComment);
    delete newComment.user;
    delete newComment.article;
    return newComment;
  }

  async updateById(
    id: number,
    comment: Partial<CreateCommentDto>,
  ): Promise<CommentDto> {
    const goalComment = await this.commentRepository.findOne(id);
    const newComment = this.commentRepository.merge(goalComment, comment);
    return this.commentRepository.save(newComment);
  }

  async findAll(queryParams: {
    sort: string;
    page: number;
    pageSize: number;
    userId: number;
    articleId: number;
  }): Promise<PaginatedDto<ListCommentDto>> {
    const { sort, page, pageSize, userId, articleId } = queryParams;
    const [comments, total] = await this.commentRepository.findAndCount({
      relations: ['user', 'article'],
      where: {
        ...(!!userId && { user: { id: userId } }),
        ...(!!articleId && { article: { id: articleId } }),
      },
      order: {
        updatedAt: sort === 'desc' ? 'DESC' : 'ASC',
      },
      skip: page * pageSize,
      take: pageSize,
    });
    const data = comments.map((comment) => ({
      ...comment,
      user: undefined,
      article: undefined,
      userId: comment.user.id,
      articleId: comment.article.id,
    }));
    return {
      total,
      results: data,
    };
  }

  async findOne(id: number): Promise<CommentDto> {
    const comment = await this.commentRepository.findOne({
      relations: ['user', 'article'],
      where: {
        id,
      },
    });
    return comment;
  }

  async deleteById(id: number) {
    const comment = await this.commentRepository.findOne(id);
    if (!comment) {
      throw new HttpException('删除失败，实体不存在', HttpStatus.BAD_REQUEST);
    }
    const childComments = await this.commentRepository.find({
      where: {
        parentId: comment.id,
      },
    });
    if (childComments.length) {
      throw new HttpException(
        '删除失败，存在关联的子评论',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await this.commentRepository.remove(comment);
      return;
    } catch (err) {
      throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
    }
  }
}
