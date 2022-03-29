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
import { ApiPagination } from 'src/decorators/ApiPagination';
import { TagDto } from 'src/dto/entities.dto';
import { PaginatedDto } from 'src/dto/paginated.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TagService } from './tag.service';

@ApiExtraModels(PaginatedDto, TagDto)
@ApiTags('tags')
// @UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOkResponse({ description: '创建标签', type: TagDto })
  @Post()
  create(@Body() tag: TagDto): Promise<TagDto> {
    return this.tagService.create(tag);
  }

  @ApiPagination({ description: '获取标签列表', model: TagDto })
  @Get()
  findAll(
    @Query('name') name: string,
    @Query('sort') sort: string,
  ): Promise<PaginatedDto<TagDto>> {
    return this.tagService.findAll({ name, sort });
  }

  @ApiOkResponse({ description: '获取标签', type: TagDto })
  @Get(':id')
  findById(@Param('id') id: number): Promise<TagDto> {
    return this.tagService.findOne(id);
  }

  @ApiOkResponse({ description: '更新标签', type: TagDto })
  @Patch(':id')
  updateById(@Param('id') id: number, @Body() tag: TagDto): Promise<TagDto> {
    return this.tagService.updateById(id, tag);
  }

  @ApiOkResponse({ description: '删除标签' })
  @Delete(':id')
  deleteById(@Param('id') id) {
    return this.tagService.deleteById(id);
  }
}
