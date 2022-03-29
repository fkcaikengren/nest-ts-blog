import { ApiProperty } from '@nestjs/swagger';

export class SortDto {
  @ApiProperty({ default: 'desc', required: false, enum: ['desc', 'asc'] })
  sort: string;
}

export class PageDto {
  @ApiProperty({ default: 0, required: false })
  page: number;
}

export class PageSizeDto {
  @ApiProperty({ default: 2, required: false })
  pageSize: number;
}

export class NameDto {
  @ApiProperty({
    default: 'javascript',
    required: false,
    enum: ['javascript', 'css'],
  })
  name: string;
}

export class CategoryIdDto {
  @ApiProperty({
    default: 1,
    required: false,
    enum: [1, 2, 3, 4, 5, 6],
  })
  categoryId: number;
}

export class TagIdsDto {
  @ApiProperty({
    default: 1,
    required: false,
    enum: [1, 2, 3, 4, 5, 6],
    isArray: true,
  })
  tagIds: number[];
}

export class ArticleIdDto {
  @ApiProperty({
    default: 1,
    required: false,
    enum: [1, 2, 3, 4, 5, 6],
  })
  articleId: number;
}

export class NicknameDto {
  @ApiProperty({
    default: '',
    required: false,
    enum: ['caikengren', 'Ajkx92'],
  })
  nickname: string;
}

export class EmailDto {
  @ApiProperty({
    default: '',
    required: false,
    enum: ['abc@qq.com'],
  })
  email: string;
}

export class PhoneDto {
  @ApiProperty({
    default: '',
    required: false,
    enum: ['18001817612'],
  })
  phone: string;
}

export class StatusDto {
  @ApiProperty({
    default: 'active',
    required: false,
    enum: ['active', 'locked'],
  })
  status: string;
}

export class RoleDto {
  @ApiProperty({
    default: 'visitor',
    required: true,
    enum: ['admin', 'visitor'],
  })
  role: string;
}
