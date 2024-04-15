import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, UserEmailDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model, ObjectId, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  UserAlreadyExistsException,
  userNotFoundException,
  wrongEmailOrPasswordException,
} from './exceptions/user.exceptions';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refreshToken.schema';
import { OtpService } from 'src/otp/otp.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  async findOneUserByEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async generateAccessToken(
    id: Types.ObjectId,
    email: string,
  ): Promise<string> {
    const payload = { email: email, id: id };
    return await this.jwtService.sign(payload);
  }

  async generateRefreshToken(): Promise<string> {
    return crypto.randomBytes(64).toString('hex');
  }

  async findRefreshToken(userId) {
    return await this.RefreshTokenModel.findOne({ userId: userId });
  }

  async deleteRefreshToken(userId) {
    return await this.RefreshTokenModel.deleteOne({ userId: userId });
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
        const accessToken = await this.generateAccessToken(
          userFinder['_id'],
          userFinder['email'],
        );

        const refreshTokenFinder = await this.findRefreshToken(
          userFinder['_id'],
        );

        if (refreshTokenFinder) {
          await this.deleteRefreshToken(userFinder['_id']);
        }

        const refreshToken = await this.generateRefreshToken();

        const currentTime = new Date();
        const refreshTokenSaver = new this.RefreshTokenModel({
          userId: userFinder['_id'],
          refreshToken: refreshToken,
          expirationTime: new Date(currentTime.getTime() + 300 * 60000),
        });
        refreshTokenSaver.save();

        return {
          message: 'User created successfully',
          accessToken: accessToken,
          refreshToken: refreshToken,
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

  async forgetPassword(userEmailDto: UserEmailDto) {
    const userFinder = await this.findOneUserByEmail(userEmailDto.email);

    if (!userFinder) {
      throw new userNotFoundException(userEmailDto.email);
    }

    const email = userFinder['email'];

    const verificationToken = await this.otpService.generateAndSendOtp(email);

    return {
      message: 'Otp sended successfully',
      verificationToken: verificationToken,
      user: {
        id: `${userFinder['_id']}`,
        email: `${userFinder['email']}`,
      },
    };
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
