import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

const jwtModule = JwtModule.register({
  secret: 'fkcaikengren',
  signOptions: { expiresIn: '30min' },
});

@Module({
  imports: [UserModule, jwtModule],
  exports: [AuthService],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
