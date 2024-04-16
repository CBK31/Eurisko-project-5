import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Schema({ timestamps: true })
export class Complaint {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [Types.ObjectId], ref: User.name, required: true })
  categorys: Types.ObjectId[];

  @Prop({
    enum: ['PENDING', 'INPROGRESS', 'RESOLVED', 'REJECTED'],
    default: 'PENDING',
  })
  status: string;
}
export const ComplaintModule = SchemaFactory.createForClass(Complaint);
export type ComplaintDocument = HydratedDocument<Complaint>;
