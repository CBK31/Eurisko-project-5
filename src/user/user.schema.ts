import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: ['admin', 'employee', 'client'], default: 'client' })
  role: string;

  @Prop({ default: true })
  isActivated: boolean;
}
export type userDocument = HydratedDocument<User>;
export const userModel = SchemaFactory.createForClass(User);
