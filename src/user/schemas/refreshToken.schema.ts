import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

@Schema()
export class RefreshToken {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true })
  expirationTime: Date;
}
export type RefreshTokenDocument = HydratedDocument<RefreshToken>;
export const RefreshTokenModel = SchemaFactory.createForClass(RefreshToken);
