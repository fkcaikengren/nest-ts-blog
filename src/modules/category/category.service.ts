import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryDto } from 'src/dto/entities.dto';
import { PaginatedDto } from 'src/dto/paginated.dto';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(category: Partial<Category>): Promise<CategoryDto> {
    const { name } = category;
    const existCategory = await this.categoryRepository.findOne({
      where: { name },
    });
    if (existCategory) {
      throw new HttpException('分类已存在', HttpStatus.BAD_REQUEST);
    }
    const newCategory: CategoryDto = this.categoryRepository.create(category); // 创建Category对象（过滤category中多余错误的字段）
    await this.categoryRepository.save(newCategory); //save成功后，newCategory会得到插入后完整的Category对象
    return newCategory;
  }

  async updateById(id: number, category: Partial<Category>): Promise<Category> {
    const goalCategory = await this.categoryRepository.findOne(id);
    const newCategory = this.categoryRepository.merge(goalCategory, category);
    return this.categoryRepository.save(newCategory);
  }

  async findAll(queryParams: {
    name: string;
    sort: string;
  }): Promise<PaginatedDto<CategoryDto>> {
    const { name, sort } = queryParams;
    const query = this.categoryRepository.createQueryBuilder('category');
    if (name) {
      query.where('category.name like :fuzzyName', { fuzzyName: `%${name}%` });
    }
    const [data, total] = await query
      .orderBy('category.createdAt', sort === 'desc' ? 'DESC' : 'ASC')
      .getManyAndCount();
    return { total, results: data };
  }

  findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOne(id);
  }

  async deleteById(id: number) {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new HttpException('删除失败，实体不存在', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.categoryRepository.remove(category);
      return;
    } catch (err) {
      // console.log(err.code);
      // console.log(err.errno);
      let errMsg = '删除失败';
      //删除时，检查外键约束，article的外键指向category表，故报错1451
      if (err.errno === 1451) {
        errMsg = '删除失败，存在关联文章';
      }
      throw new HttpException(errMsg, HttpStatus.BAD_REQUEST);
    }
  }
}
