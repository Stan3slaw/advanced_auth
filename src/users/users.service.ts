import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';

import type { CreateUserDto } from './dto/createUser.dto';

import type { UserDocument } from './schemas/users.schema';
import { User } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create = async (user: CreateUserDto): Promise<UserDocument> => {
    const hashedPassword = await hash(user.password, 10);
    const createdUser = new this.userModel({ ...user, password: hashedPassword });

    return createdUser.save();
  };

  findOneWithPassword = async (email: string): Promise<UserDocument | null> => {
    const user = await this.userModel.findOne({ email });

    return user;
  };
}
