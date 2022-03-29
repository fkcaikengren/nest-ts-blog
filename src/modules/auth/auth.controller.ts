import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthUserDto, EmailLoginUserDto } from 'src/dto/entities.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description: '用户登录(邮箱)',
    type: AuthUserDto,
  })
  @Post('login')
  login(@Body() user: EmailLoginUserDto): Promise<AuthUserDto> {
    return this.authService.login(user);
  }
}
