import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model, ObjectId, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  UserAlreadyExistsException,
  userNotFoundException,
  wrongEmailOrPasswordException,
} from './exceptions/user.exceptions';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async findOneUserByEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  generateAccessToken(id: Types.ObjectId, email: string): string {
    const payload = { email: email, id: id };
    return this.jwtService.sign(payload);
  }
  generateRefreshToken(): string {
    return crypto.randomBytes(32).toString('hex');
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

      const userCreated = await newUser.save();
      return {
        message: 'User created successfully',
        user: { id: `${userCreated['_id']}`, email: `${userCreated['email']}` },
      };
    }
  }

  async logIn(loginUserDto: LoginUserDto) {
    const userFinder = await this.findOneUserByEmail(loginUserDto.email);

    if (!userFinder) {
      throw new wrongEmailOrPasswordException();
    } else {
      let passChecker = await bcrypt.compare(
        loginUserDto.password,
        userFinder.password,
      );
      if (passChecker) {
        const generatedToken = this.generateAccessToken(
          userFinder['_id'],
          userFinder['email'],
        );

        const refreshToken = this.generateRefreshToken();

        //bedde sayiv hel refreshToken bel database w eb3ato lal user

        return {
          message: 'User created successfully',
          accessToken: generatedToken,
          user: {
            id: `${userFinder['_id']}`,
            email: `${userFinder['email']}`,
            firstName: `${userFinder['firstName']}`,
            lastName: `${userFinder['lastName']}`,
          },
        };
      } else {
        throw new wrongEmailOrPasswordException();
      }
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
