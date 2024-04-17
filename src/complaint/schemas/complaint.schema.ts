import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Category } from 'src/category/schemas/category.schema';
import { User } from 'src/user/schemas/user.schema';

@Schema({ timestamps: true })
export class Complaint {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [Types.ObjectId], ref: Category.name, required: true })
  categories: Types.ObjectId[];

  @Prop({
    enum: ['PENDING', 'INPROGRESS', 'RESOLVED', 'REJECTED'],
    default: 'PENDING',
  })
  status: string;
}
export const ComplaintModel = SchemaFactory.createForClass(Complaint);
export type ComplaintDocument = HydratedDocument<Complaint>;
ComplaintModel.index({ createdBy: 1, status: 1 });
