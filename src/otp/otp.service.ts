import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { OTP } from './schema/otp.schema';
import { GenerateOtpDto, SendOtpDto } from './dto/otp-dto';
import * as crypto from 'crypto';
import { otpAlreadyExistAndValidException } from './exceptions/otp.exceptions';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(OTP.name) private OTPModel: Model<OTP>,
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

  //TO BE CONTINUED
  async sendExistingValidOtp(email) {
    const OtpFinderAndValidator = await this.OtpIsValid(email);
    if (!OtpFinderAndValidator) {
      console.log('send unvalid otp exception');
    }

    console.log('sending your Otp');
  }

  async OtpIsValid(email?: string, id?: string) {
    let userid;
    if (email) {
      const userFinder = await this.findOneUserByEmail(email);
      userid = userFinder['_id'];
    } else if (id) {
      userid = id;
    } else {
      return false;
    }
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

  async generateAndSendOtp(id, email) {
    const OtpFinderAndValidator = await this.OtpIsValid(id);
    if (OtpFinderAndValidator) {
      console.log('send otp already exist and valid error ');
      throw new otpAlreadyExistAndValidException();
    }

    const newOtp = Math.floor(1000 + Math.random() * 9999).toString();
    const verificationToken = crypto.randomBytes(64).toString('hex');
    const currentTime = new Date();

    const otpSaver = new this.OTPModel({
      userId: id,
      verificationToken: verificationToken,
      otpCode: newOtp,
      expirationDate: new Date(currentTime.getTime() + 5 * 60000),
      life: 5,
      isUsed: false,
    });

    const verificationTokenSaved = await otpSaver.save();

    await this.sendExistingValidOtp(email);

    return verificationTokenSaved.verificationToken;
  }
}

// if (userFinder) {
//   const otpFinder = await this.findOtpByUserId(userFinder['_id']);
//   const currentDate = new Date();
//   if (
//     otpFinder &&
//     otpFinder['expirationDate'].getTime() > currentDate.getTime()
//   ) {
//     console.log('send the existing Otp ');
//   } else {
//     console.log('current Time : ' + currentDate.getTime());
//     console.log('otpFinder ' + otpFinder);
//     console.log(
//       'otp expiration date ' + otpFinder['expirationDate'].getTime(),
//     );
//     console.log(
//       'is obsolet ? :' +
//         (otpFinder['expirationDate'].getTime() < currentDate.getTime()),
//     );

//     console.log('userDoNotHaveOtpException');

//     // return error userDoNotHaveOtpException
//   }
// } else {
//   console.log('userNotFoundException');
//   // return error userNotFoundException
// }
