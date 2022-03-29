import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { PaginatedDto } from 'src/dto/paginated.dto';
import { ApiPagination } from 'src/decorators/ApiPagination';
import {
  CreateArticleDto,
  ListArticleDto,
  ArticleDto,
} from 'src/dto/entities.dto';
import {
  SortDto,
  PageDto,
  PageSizeDto,
  CategoryIdDto,
  TagIdsDto,
} from 'src/dto/queries.dto';

@ApiExtraModels(PaginatedDto, CreateArticleDto, ListArticleDto, ArticleDto)
@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOkResponse({ description: '创建文章', type: ArticleDto })
  @Post()
  create(@Body() article: CreateArticleDto): Promise<ArticleDto> {
    return this.articleService.create(article);
  }

  @ApiPagination({ description: '获取文章列表', model: ListArticleDto })
  @ApiQuery({ name: 'sort', type: SortDto })
  @ApiQuery({ name: 'pageSize', type: PageSizeDto })
  @ApiQuery({ name: 'page', type: PageDto })
  @ApiQuery({ name: 'tagIds', type: TagIdsDto })
  @ApiQuery({ name: 'categoryId', type: CategoryIdDto })
  @Get()
  findAll(
    @Query()
    queryParams: {
      sort: string;
      page: number;
      pageSize: number;
      categoryId: number;
      tagIds: number[];
      isRecommended: boolean;
    },
  ): Promise<PaginatedDto<ListArticleDto>> {
    return this.articleService.findAll(queryParams);
  }

  @ApiOkResponse({ description: '获取文章', type: ArticleDto })
  @Get(':id')
  findById(@Param('id') id: number): Promise<ArticleDto> {
    return this.articleService.findOne(id);
  }

  @ApiOkResponse({ description: '更新文章', type: ArticleDto })
  @Patch(':id')
  updateById(
    @Param('id') id: number,
    @Body() article: CreateArticleDto,
  ): Promise<ArticleDto> {
    return this.articleService.updateById(id, article);
  }

  @ApiOkResponse({ description: '删除文章' })
  @Delete(':id')
  deleteById(@Param('id') id: number) {
    return this.articleService.deleteById(id);
  }
}
