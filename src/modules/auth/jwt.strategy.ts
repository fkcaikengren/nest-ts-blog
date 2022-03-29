import { UserService } from './../user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// 当传递给Passport的策略是jwt时，password自动查找JwtStrategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'fkcaikengren',
    });
  }

  async validate(payload: any) {
    const { sub: userId } = payload;
    const user = await this.userService.findOne(userId);
    return user;
  }
}
