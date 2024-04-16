import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { OTP } from './schema/otp.schema';
import { ConfigService } from '@nestjs/config';
import { VerifyOtpDto } from './dto/otp-dto';
import * as crypto from 'crypto';
import {
  InvalidOtpException,
  otpAlreadyExistAndValidException,
} from './exceptions/otp.exceptions';
import axios from 'axios';
import { noAccountFoundForSecurity } from 'src/user/exceptions/user.exceptions';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(OTP.name) private OTPModel: Model<OTP>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async findOneUserByEmail(email) {
    return await this.userModel.findOne({ email: email });
  }

  async findOtpByUserId(userId) {
    return await this.OTPModel.findOne({ userId: userId });
  }

  async deleteOneOtpById(otpId) {
    return await this.OTPModel.deleteOne({ _id: otpId });
  }

  async sendOtp(email: string, otpCode: any) {
    const data = new URLSearchParams({
      apikey: this.configService.get<string>('axiosApiInfo.apiKey'),
      subject: 'your OTP code',
      from: this.configService.get<string>('axiosApiInfo.senderEmail'),
      to: email as string,
      bodyHtml: `your OTP code is :  ${otpCode}`,
      isTransactional: 'true',
    });

    await axios.post('https://api.elasticemail.com/v2/email/send', data);
    return true;
  }

  async OtpIsValid(email: string) {
    const userFinder = await this.findOneUserByEmail(email);
    if (!userFinder) {
      throw new noAccountFoundForSecurity();
    }
    const userid = userFinder['_id'];

    const otpFinder = await this.findOtpByUserId(userid);
    const currentDate = new Date();
    if (
      otpFinder &&
      otpFinder['expirationDate'].getTime() > currentDate.getTime() &&
      otpFinder['life'] > 0 &&
      !otpFinder['isUsed']
    ) {
      return otpFinder;
    } else if (otpFinder) {
      await this.deleteOneOtpById(otpFinder['_id']);
    }
    return false;
  }

  async generateAndSendOtp(email: string) {
    const OtpFinderAndValidator = await this.OtpIsValid(email);
    if (OtpFinderAndValidator) {
      throw new otpAlreadyExistAndValidException();
    }

    const userFinder = await this.findOneUserByEmail(email);
    const newOtp = Math.floor(1000 + Math.random() * 9999);
    const verificationToken = crypto.randomBytes(64).toString('hex');
    const currentTime = new Date();

    const otpSaver = new this.OTPModel({
      userId: userFinder['_id'],
      verificationToken: verificationToken,
      otpCode: newOtp,
      expirationDate: new Date(currentTime.getTime() + 5 * 60000),
      life: 5,
      isUsed: false,
    });

    const verificationTokenSaved = await otpSaver.save();

    await this.sendOtp(email, newOtp);

    return verificationTokenSaved.verificationToken;
  }

  async resendOtp(email: string) {
    const OtpFinderAndValidator = await this.OtpIsValid(email);
    let verificationToken;
    if (OtpFinderAndValidator) {
      await this.sendOtp(email, OtpFinderAndValidator['otpCode']);
      verificationToken = OtpFinderAndValidator['verificationToken'];
    } else {
      verificationToken = await this.generateAndSendOtp(email);
    }

    return {
      message: 'Otp sended successfully',
      verificationToken: verificationToken,
      user: {
        id: OtpFinderAndValidator['userId'],
        email: email,
      },
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const OtpFinderAndValidator = await this.OtpIsValid(verifyOtpDto.email);
    if (
      OtpFinderAndValidator &&
      OtpFinderAndValidator['otpCode'] == verifyOtpDto.otpCode &&
      OtpFinderAndValidator['verificationToken'] ==
        verifyOtpDto.verificationToken
    ) {
      const updateDoc = {
        $set: {
          isUsed: true,
        },
      };
      await this.OTPModel.updateOne(
        { _id: OtpFinderAndValidator['_id'] },
        updateDoc,
      );

      const payload = {
        id: OtpFinderAndValidator['userId'],
        email: verifyOtpDto.email,
      };

      return {
        message: 'Otp verified successfully',
        accessToken: this.jwtService.sign(payload),
        user: {
          id: `${OtpFinderAndValidator['userId']}`,
        },
      };
    } else if (OtpFinderAndValidator) {
      const updateDoc = {
        $inc: {
          life: -1,
        },
      };
      await this.OTPModel.updateOne(
        { _id: OtpFinderAndValidator['_id'] },
        updateDoc,
      );
    }

    throw new InvalidOtpException();
  }
}
