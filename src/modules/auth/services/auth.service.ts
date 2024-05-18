import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserDocument } from '../../user/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private postModel: Model<UserDocument>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(data: any) {
    return await this.userService.create(data);
  }

  public async login(data: any) {
    const user = await this.userService.findOneByEmail(data.email);

    if (!user) {
      throw new BadRequestException('Incorrect email or password');
    }

    if (user.password !== data.password) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, user };

    return {
      token: await this.jwtService.signAsync(payload),
      user,
    };
  }
}
