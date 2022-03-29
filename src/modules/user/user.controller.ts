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
import {
  ApiTags,
  ApiOkResponse,
  ApiQuery,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ApiPagination } from 'src/decorators/ApiPagination';
import {
  EmailLoginUserDto,
  EmailRegisterUserDto,
  UserDto,
} from 'src/dto/entities.dto';
import { PaginatedDto } from 'src/dto/paginated.dto';
import {
  EmailDto,
  RoleDto,
  PhoneDto,
  StatusDto,
  SortDto,
  PageDto,
  PageSizeDto,
  NicknameDto,
} from 'src/dto/queries.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@ApiExtraModels(PaginatedDto, UserDto, EmailRegisterUserDto, EmailLoginUserDto)
@ApiTags('users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    description: '用户注册(邮箱)',
    type: UserDto,
  })
  @Post('register')
  register(@Body() user: EmailRegisterUserDto) {
    return this.userService.register(user);
  }

  @ApiPagination({ description: '获取用户列表', model: UserDto })
  @ApiQuery({ name: 'role', type: RoleDto })
  @ApiQuery({ name: 'nickname', type: NicknameDto })
  @ApiQuery({ name: 'email', type: EmailDto })
  @ApiQuery({ name: 'phone', type: PhoneDto })
  @ApiQuery({ name: 'status', type: StatusDto })
  @ApiQuery({ name: 'sort', type: SortDto })
  @ApiQuery({ name: 'page', type: PageDto })
  @ApiQuery({ name: 'pageSize', type: PageSizeDto })
  @Get()
  findAll(
    @Query()
    queryParams: {
      role: string;
      nickname: string;
      email: string;
      phone: string;
      status: string;
      sort: string;
      page: number;
      pageSize: number;
    },
  ): Promise<PaginatedDto<UserDto>> {
    return this.userService.findAll(queryParams);
  }

  @ApiOkResponse({ description: '获取用户', type: UserDto })
  @Get(':id')
  findById(@Param('id') id: number): Promise<UserDto> {
    return this.userService.findOne(id);
  }

  @ApiOkResponse({ description: '更新用户', type: UserDto })
  @Patch(':id')
  updateById(@Param('id') id: number, @Body() user: UserDto): Promise<UserDto> {
    return this.userService.updateById(id, user);
  }

  @ApiOkResponse({ description: '删除用户' })
  @Delete(':id')
  deleteById(@Param('id') id) {
    return this.userService.deleteById(id);
  }
}
