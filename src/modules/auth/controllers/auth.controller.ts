import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Login 
   */
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() payload: CreateUserDto) {
    return this.authService.register(payload);
  }

  /**
   * Register
   */
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }
}
