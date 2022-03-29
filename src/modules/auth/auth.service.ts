import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailLoginUserDto } from 'src/dto/entities.dto';
import { UserService } from '../user/user.service';
import { AuthUserDto } from './../../dto/entities.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: EmailLoginUserDto): Promise<AuthUserDto> {
    const { email, password } = user;
    const authUser = await this.validateUser(email, password);
    if (!authUser) throw new HttpException('认证失败', HttpStatus.UNAUTHORIZED);
    return {
      ...authUser,
      accessToken: this.jwtService.sign({
        sub: authUser.id,
      }),
    };
  }

  // 验证用户
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && user.password !== password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
