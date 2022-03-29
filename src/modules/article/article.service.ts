import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CategoryService } from './../category/category.service';
import { TagService } from '../tag/tag.service';
import {
  ArticleDto,
  CreateArticleDto,
  ListArticleDto,
} from 'src/dto/entities.dto';
import { PaginatedDto } from 'src/dto/paginated.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
  ) {}

  async create(article: Partial<CreateArticleDto>): Promise<ArticleDto> {
    const { categoryId, tagIds } = article;
    const newArticle = this.articleRepository.create(article);
    if (categoryId) {
      newArticle.category = await this.categoryService.findOne(categoryId);
    }
    if (tagIds) {
      newArticle.tags = await this.tagService.findByIds(
        tagIds instanceof Array ? tagIds : [tagIds],
      );
    }
    await this.articleRepository.save(newArticle);
    return newArticle;
  }

  async updateById(
    id: number,
    article: Partial<CreateArticleDto>,
  ): Promise<ArticleDto> {
    const { categoryId, tagIds } = article;
    const goalArticle = await this.articleRepository.findOne({
      relations: ['category', 'tags'],
      where: { id },
    });
    const newArticle = this.articleRepository.merge(goalArticle, article);
    if (categoryId) {
      newArticle.category = await this.categoryService.findOne(categoryId);
    }
    if (tagIds) {
      newArticle.tags = await this.tagService.findByIds(
        tagIds instanceof Array ? tagIds : [tagIds],
      );
    }
    return this.articleRepository.save(newArticle);
  }

  findOne(id: number): Promise<ArticleDto> {
    return this.articleRepository.findOne({
      relations: ['category', 'tags'], //和哪些表连接，仅做简单的left join.
      where: { id },
    });
  }

  findOneWithoutRelation(id: number): Promise<ArticleDto> {
    return this.articleRepository.findOne(id);
  }

  async findAll(queryParams: {
    sort: string;
    page: number;
    pageSize: number;
    categoryId: number;
    tagIds: number[];
    isRecommended: boolean;
  }): Promise<PaginatedDto<ListArticleDto>> {
    const { sort, page, pageSize, categoryId, tagIds, isRecommended } =
      queryParams;
    const query = this.articleRepository.createQueryBuilder('article'); //entity class lowercase name

    query.leftJoinAndSelect('article.tags', 'tag').innerJoinAndSelect(
      'article.category', //reference
      'category', //alias of table
    );
    if (categoryId) {
      query.where('category.id = :categoryId', { categoryId });
    }
    if (tagIds) {
      query.where('tag.id IN (:...tagIds)', {
        tagIds: tagIds instanceof Array ? tagIds : [tagIds],
      });
    }
    if (isRecommended) {
      query.where('isRecommended = 1');
    }
    console.log(isRecommended);
    const [data, total] = await query
      .orderBy('article.createdAt', sort === 'desc' ? 'DESC' : 'ASC')
      .offset(page * pageSize)
      .limit(pageSize)
      .getManyAndCount();
    data.forEach((item) => {
      delete item.content;
      delete item.html;
      delete item.toc;
    });
    return { total, results: data };
  }

  async deleteById(id: number) {
    try {
      const article = await this.articleRepository.findOne(id);
      await this.articleRepository.remove(article);
      return;
    } catch (err) {
      throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
    }
  }
}

/*
一.查询要点
  1.分页
   request: page, pageSize
   query: offset:page*pagesize, limit:pageSize
   response: total, page, pageSize
  2.排序
  sort: desc|asc
  3.筛选
    筛选-category 
    category:categoryId （和category联表）
    筛选-tag    
    tag:tagId   （和tag联表）

二.文章相关操作
  1.点赞+1
  2.访问+1
*/
