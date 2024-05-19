import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(data: CreateUserDto) {
    // create user
    return await this.userService.create(data);
  }

  public async login(data: LoginDto) {
    // Get user
    const user = await this.userService.findOneByEmail(data.email);

    // Check if user exist or password mathc
    if (!user || !(await argon2.verify(user.password, data.password))) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const payload = { sub: user.id, user };

    return {
      token: await this.jwtService.signAsync(payload),
      user,
    };
  }
}
