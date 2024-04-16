import { Injectable } from '@nestjs/common';
import {
  ActivateUserDto,
  ChangePasswordDto,
  CreateCmsUserDto,
  CreateUserDto,
  GetAccessTokenDto,
  LoginUserDto,
  ResetPasswordDto,
  UserEmailDto,
} from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model, ObjectId, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  noAccountFoundForSecurity,
  UserAlreadyExistsException,
  UserIdNotFoundException,
  userNotFoundException,
  wrongEmailOrPasswordException,
  resetPasswordException,
  refreshTokenOrUserInvalidException,
  PasswordUnmatchException,
} from './exceptions/user.exceptions';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refreshToken.schema';
import { OtpService } from 'src/otp/otp.service';
import { Roles } from 'src/shared/decorators/roles.decorators';

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

  async findUserById(userId) {
    try {
      return await this.userModel.findById(userId);
    } catch (error) {
      throw new UserIdNotFoundException();
    }
  }

  async updateUserPassword(userId, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updateDoc = {
      $set: {
        password: hashedPassword,
      },
    };
    return await this.userModel.findByIdAndUpdate(userId, updateDoc);
  }

  async generateAccessToken(id): Promise<string> {
    const payload = { id: id };
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

  async create(createUserDto: CreateUserDto): Promise<object> {
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
        user: {
          id: `${userCreated['_id']}`,
          email: `${userCreated['email']}`,
        },
      };
    }
  }

  async createCmsUser(createCmsUserDto: CreateCmsUserDto): Promise<object> {
    if (await this.findOneUserByEmail(createCmsUserDto.email)) {
      throw new UserAlreadyExistsException(createCmsUserDto.email);
    } else {
      const { firstName, lastName, email, password, role } = createCmsUserDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new this.userModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role,
        isActivated: true,
      });

      const userCreated = await newUser.save();
      return {
        message: 'User created successfully',
        user: {
          id: `${userCreated['_id']}`,
          email: `${userCreated['email']}`,
        },
      };
    }
  }

  async logIn(loginUserDto: LoginUserDto): Promise<object> {
    const userFinder = await this.findOneUserByEmail(loginUserDto.email);

    if (!userFinder) {
      throw new wrongEmailOrPasswordException();
    } else {
      const { email, password, _id, firstName, lastName } = userFinder;

      const passChecker = await bcrypt.compare(loginUserDto.password, password);
      if (passChecker) {
        const accessToken = await this.generateAccessToken(_id);

        const refreshTokenFinder = await this.findRefreshToken(_id);

        if (refreshTokenFinder) {
          await this.deleteRefreshToken(_id);
        }

        const refreshToken = await this.generateRefreshToken();

        const currentTime = new Date();
        const refreshTokenSaver = new this.RefreshTokenModel({
          userId: _id,
          refreshToken: refreshToken,
          expirationTime: new Date(currentTime.getTime() + 300 * 60000),
        });
        refreshTokenSaver.save();

        return {
          message: 'User created successfully',
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: {
            id: `${_id}`,
            email: `${email}`,
            firstName: `${firstName}`,
            lastName: `${lastName}`,
          },
        };
      } else {
        throw new wrongEmailOrPasswordException();
      }
    }
  }

  async forgetPassword(userEmailDto: UserEmailDto): Promise<object> {
    const userFinder = await this.findOneUserByEmail(userEmailDto.email);

    if (!userFinder) {
      throw new noAccountFoundForSecurity();
    }
    const { email, _id } = userFinder;

    const verificationToken = await this.otpService.generateAndSendOtp(email);

    return {
      message: 'Otp sended successfully',
      verificationToken: verificationToken,
      user: {
        id: `${_id}`,
        email: `${email}`,
      },
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    userId,
  ): Promise<object> {
    const { newPassword, confirmPassword } = resetPasswordDto;
    if (newPassword == confirmPassword) {
      const userFinder = await this.findUserById(userId);
      await this.updateUserPassword(userId, newPassword);

      return {
        message: 'Your password has been successfully reset',
        user: {
          id: `${userId}`,
          email: `${userFinder['email']}`,
        },
      };
    }

    throw new resetPasswordException();
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    userId,
  ): Promise<object> {
    const { oldPassword, newPassword } = changePasswordDto;
    const userFinder = await this.findUserById(userId);
    const { password, email } = userFinder;
    let passChecker = await bcrypt.compare(oldPassword, password);
    if (passChecker) {
      await this.updateUserPassword(userId, newPassword);

      return {
        message: 'Your password has been successfully updated',
        user: {
          id: `${userId}`,
          email: `${email}`,
        },
      };
    }

    throw new PasswordUnmatchException();
  }

  async getaccesstoken(
    id,
    getAccessTokenDto: GetAccessTokenDto,
  ): Promise<object> {
    const { refreshToken } = getAccessTokenDto;

    const refreshTokenFinder = await this.findRefreshToken(id);

    if (
      refreshTokenFinder &&
      refreshTokenFinder['refreshToken'] == refreshToken &&
      refreshTokenFinder['expirationTime'] > new Date()
    ) {
      const newAccessToken = await this.generateAccessToken(id);
      return {
        message: 'Access token successfully generated ',
        accessToken: newAccessToken,
        user: {
          id: `${id}`,
        },
      };
    }

    throw new refreshTokenOrUserInvalidException();
  }

  async updateActivationStatus(
    id: string,
    isActivated: boolean,
  ): Promise<object> {
    const userFinder = await this.findUserById(id);
    if (!userFinder) {
      throw new UserIdNotFoundException();
    }

    const updateDoc = {
      $set: {
        isActivated: isActivated,
      },
    };
    await this.userModel.findByIdAndUpdate(id, updateDoc);

    return {
      message: 'account activation changed successfully',
    };
  }

  async CmsRoleToAdmin(id): Promise<object> {
    const userFinder = await this.findUserById(id);
    if (!userFinder) {
      throw new UserIdNotFoundException();
    }

    const updateDoc = {
      $set: {
        role: 'admin',
      },
    };
    await this.userModel.findByIdAndUpdate(id, updateDoc);

    return {
      message: 'account role changed to admin successfully',
    };
  }

  async GetMyCmsDetails(id): Promise<object> {
    return await this.findUserById(id);
  }

  async GetAllCmsDetails(page: number, limit: number): Promise<object> {
    const skip = (page - 1) * limit;

    const data = await this.userModel
      .find({ role: { $in: ['admin', 'employee'] } })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = Object.keys(data).length;

    return { data, total, page, limit };
  }
  // const pipeline = [
  //   {
  //     $match: {
  //       role: { $in: ['admin', 'employee'] },
  //     },
  //   },
  //   {
  //     $facet: {
  //       data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
  //       total: [
  //         {
  //           $count: 'count',
  //         },
  //       ],
  //     },
  //   },
  // ];

  // const result = await this.userModel.aggregate(pipeline);

  // const data = result[0].data;
  // const total = result[0].total.length > 0 ? result[0].total[0].count : 0;

  // return { data, total, page, limit };
}
