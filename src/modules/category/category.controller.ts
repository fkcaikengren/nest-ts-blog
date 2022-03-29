import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiExtraModels,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { ApiPagination } from 'src/decorators/ApiPagination';
import { CategoryDto } from 'src/dto/entities.dto';
import { PaginatedDto } from 'src/dto/paginated.dto';
import { NameDto, SortDto } from 'src/dto/queries.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';

@ApiExtraModels(PaginatedDto, CategoryDto)
@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOkResponse({ description: '创建分类', type: CategoryDto })
  @Post()
  create(@Body() category: CategoryDto): Promise<CategoryDto> {
    return this.categoryService.create(category);
  }

  @ApiQuery({ name: 'name', type: NameDto })
  @ApiQuery({ name: 'sort', type: SortDto })
  @ApiPagination({
    description: '获取分类列表',
    model: CategoryDto,
  })
  @Get()
  findAll(
    @Query('name') name: string,
    @Query('sort') sort: string,
  ): Promise<PaginatedDto<CategoryDto>> {
    return this.categoryService.findAll({ name, sort });
  }

  @ApiOkResponse({ description: '获取分类', type: CategoryDto })
  @Get(':id')
  findById(@Param('id') id: number): Promise<CategoryDto> {
    return this.categoryService.findOne(id);
  }

  @ApiOkResponse({ description: '更新分类', type: CategoryDto })
  @Patch(':id')
  updateById(
    @Param('id') id: number,
    @Body() category: CategoryDto,
  ): Promise<CategoryDto> {
    return this.categoryService.updateById(id, category);
  }

  @ApiOkResponse({ description: '删除分类' })
  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAuthGuard)
  // @Roles('admin')
  @Delete(':id')
  deleteById(@Param('id') id: number) {
    return this.categoryService.deleteById(id);
  }
}
