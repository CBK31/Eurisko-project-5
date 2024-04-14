// otp.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema'; // Adjust the import based on your project structure

@Schema()
export class OTP {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  verificationToken: string;

  @Prop({ required: true })
  otpCode: Number;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ required: true, default: 0 })
  life: number;

  @Prop({ required: true, default: false })
  isUsed: boolean;
}

export const OTPModel = SchemaFactory.createForClass(OTP);
export type OTPDocument = HydratedDocument<OTP>;
