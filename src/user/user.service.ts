import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';
import { UserAlreadyExistsException } from './exceptions/user.exceptions';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOneUserByEmail(email: string) {
    return this.userModel.findOne({ email: email });
  }

  async create(createUserDto: CreateUserDto) {
    if (await this.findOneUserByEmail(createUserDto.email)) {
      throw new UserAlreadyExistsException(createUserDto.email);
    } else {
      const { firstName, lastName, email, password } = createUserDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new this.userModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'client',
        isActivated: true,
      });

      return newUser.save();
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
