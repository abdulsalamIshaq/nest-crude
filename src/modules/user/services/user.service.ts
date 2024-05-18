import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.model';
import CurrentUser from '../../../shared/utils/current-user.util';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async findOneByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email });
  }

  public async create(data: CreateUserDto): Promise<UserDocument> {
    // if user already exist
    const user = await this.userModel.exists({
      email: data.email,
    });

    // throw bad request if user already exist in our record
    if (user) {
      throw new BadRequestException('Email already exist in our record');
    }

    // crate user
    return await this.userModel.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  }

  public profile(): User {
    return CurrentUser.get();
  }
}
