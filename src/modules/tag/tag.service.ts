import { TagDto } from './../../dto/entities.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { PaginatedDto } from 'src/dto/paginated.dto';
@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(tag: Partial<TagDto>): Promise<TagDto> {
    const { name } = tag;
    if (!name) {
      throw new HttpException('名称不能为空', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const existTag = await this.tagRepository.findOne({
      where: { name },
    });
    if (existTag) {
      throw new HttpException('名称已存在', HttpStatus.BAD_REQUEST);
    }
    const newTag = this.tagRepository.create(tag);
    await this.tagRepository.save(newTag);
    return newTag;
  }

  async updateById(id: number, tag: Partial<Tag>): Promise<TagDto> {
    const goalTag = await this.tagRepository.findOne(id);
    const newTag = this.tagRepository.merge(goalTag, tag);
    return this.tagRepository.save(newTag);
  }

  async findAll(queryParams: {
    name: string;
    sort: string;
  }): Promise<PaginatedDto<TagDto>> {
    const { name, sort } = queryParams;
    const query = this.tagRepository.createQueryBuilder('tag');
    if (name) {
      query.where('tag.name like :fuzzyName', { fuzzyName: `%${name}%` });
    }
    const [data, total] = await query
      .orderBy('tag.createdAt', sort === 'desc' ? 'DESC' : 'ASC')
      .getManyAndCount();
    return {
      total,
      results: data,
    };
  }

  findOne(id: number): Promise<TagDto> {
    return this.tagRepository.findOne(id);
  }

  findByIds(ids: number[]): Promise<Tag[]> {
    return this.tagRepository.findByIds(ids);
  }

  async deleteById(id: number) {
    const tag = await this.tagRepository.findOne(id);
    if (!tag) {
      throw new HttpException('删除失败，实体不存在', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.tagRepository.remove(tag);
      return;
    } catch (err) {
      // console.log(err.code);
      // console.log(err.errno);
      let errMsg = '删除失败';
      //删除时，检查外键约束，article的外键指向tag表，故报错1451
      if (err.errno === 1451) {
        errMsg = '删除失败，存在关联文章';
      }
      throw new HttpException(errMsg, HttpStatus.BAD_REQUEST);
    }
  }
}
