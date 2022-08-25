import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';

import type { CreateUserDto } from './dto/create-user.dto';

import type { UserDocument } from './schemas/users.schema';
import { User } from './schemas/users.schema';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create = async (user: CreateUserDto): Promise<UserDocument> => {
    const hashedPassword = await hash(user.password, 10);
    const createdUser = new this.userModel({ ...user, password: hashedPassword });

    return createdUser.save();
  };

  findAll = async (): Promise<UserDto[]> => {
    const foundUsersWithSecureInfo = await this.userModel.find();
    const foundUsers = foundUsersWithSecureInfo.map(({ _id, email, fullname }) => ({ _id, email, fullname }));

    return foundUsers;
  };

  findOneWithPassword = async (email: string): Promise<UserDocument | null> => {
    const user = await this.userModel.findOne({ email });

    return user;
  };

  update = async (userId: number, updateUserDto: UpdateUserDto): Promise<UserDocument> => {
    return this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true });
  };
}
