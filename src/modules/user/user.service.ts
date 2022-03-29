import { User } from './user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EmailLoginUserDto,
  EmailRegisterUserDto,
  UserDto,
} from 'src/dto/entities.dto';
import { PaginatedDto } from 'src/dto/paginated.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(user: EmailRegisterUserDto) {
    const { nickname, email, password, emailCode } = user;
    // 验证参数
    if (!nickname) {
      throw new HttpException('昵称不能为空', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (!email) {
      throw new HttpException('邮箱不能为空', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (!password) {
      throw new HttpException('密码不能为空', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (!emailCode) {
      throw new HttpException(
        '邮箱验证码不能为空',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    // 验证邮箱验证码
    const isCodeCorrect = emailCode === 'abc';
    if (!isCodeCorrect) {
      throw new HttpException(
        '邮箱验证码错误',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    // 验证用户是否已存在
    if (!this.isEmailExisted(email)) {
      throw new HttpException('邮箱已被注册', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    // 创建用户
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);
    delete newUser.password;
    return newUser;
  }

  async sendEmailCode() {
    return 'abc';
  }

  async isEmailExisted(email: string) {
    const existUser = await this.userRepository.findOne({
      email,
    });
    return existUser;
  }

  async login(data: EmailLoginUserDto): Promise<UserDto> {
    const { email, password } = data;
    const user = await this.userRepository.findOne({
      email,
      password,
    });
    if (!user) {
      throw new HttpException('账号或密码错误', HttpStatus.UNAUTHORIZED);
    }
    // 携带token信息
    return user;
  }

  async findAll(queryParams: {
    role: string;
    nickname: string;
    email: string;
    phone: string;
    status: string;
    sort: string;
    page: number;
    pageSize: number;
  }): Promise<PaginatedDto<UserDto>> {
    const { role, nickname, email, phone, status, sort, page, pageSize } =
      queryParams;
    if (!role) {
      throw new HttpException('缺少参数 role', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const [users, total] = await this.userRepository.findAndCount({
      where: {
        role,
        ...(!!nickname && { nickname }),
        ...(!!email && { email }),
        ...(!!phone && { phone }),
        ...(!!status && { status }),
      },
      order: {
        updatedAt: sort === 'desc' ? 'DESC' : 'ASC',
      },
      skip: page * pageSize,
      take: pageSize,
    });
    return { total, results: users };
  }

  findOne(id: number): Promise<UserDto> {
    return this.userRepository.findOne(id);
  }

  async findOneByEmail(email: string): Promise<UserDto> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async updateById(id: number, user: Partial<UserDto>): Promise<UserDto> {
    const goalUser = await this.userRepository.findOne(id);
    if (!goalUser) {
      throw new HttpException('修改失败，该用户不存在', HttpStatus.BAD_REQUEST);
    }
    const newUser = this.userRepository.merge(goalUser, user);
    return this.userRepository.save(newUser);
  }

  async deleteById(id: number) {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new HttpException('删除失败，实体不存在', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.userRepository.remove(user);
      return;
    } catch (err) {
      // console.log(err.code);
      // console.log(err.errno);
      let errMsg = '删除失败';
      //删除时，检查外键约束， comment的外键指向user表，故报错1451
      if (err.errno === 1451) {
        errMsg = '删除失败，存在关联评论';
      }
      throw new HttpException(errMsg, HttpStatus.BAD_REQUEST);
    }
  }
}
