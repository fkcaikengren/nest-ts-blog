import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import {
  CommentDto,
  CreateCommentDto,
  ListCommentDto,
} from './../../dto/entities.dto';
import { PaginatedDto } from 'src/dto/paginated.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiExtraModels(PaginatedDto, CreateCommentDto, CommentDto)
@ApiTags('comments')
// @UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() comment: CreateCommentDto): Promise<CommentDto> {
    return this.commentService.create(comment);
  }

  @Get()
  findAll(
    @Query()
    queryParams: {
      sort: string;
      page: number;
      pageSize: number;
      userId: number;
      articleId: number;
    },
  ): Promise<PaginatedDto<ListCommentDto>> {
    return this.commentService.findAll(queryParams);
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<CommentDto> {
    return this.commentService.findOne(id);
  }

  @ApiOkResponse({ description: '更新评论', type: CommentDto })
  @Patch(':id')
  updateById(
    @Param('id') id: number,
    @Body() comment: CreateCommentDto,
  ): Promise<CommentDto> {
    return this.commentService.updateById(id, comment);
  }

  @ApiOkResponse({ description: '删除文章' })
  @Delete(':id')
  deleteById(@Param('id') id: number) {
    return this.commentService.deleteById(id);
  }
}
