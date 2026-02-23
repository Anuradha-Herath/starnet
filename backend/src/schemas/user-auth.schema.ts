import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserAuthDocument = UserAuth & Document;

@Schema()
export class UserAuth {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  password_hash: string;
}

export const UserAuthSchema = SchemaFactory.createForClass(UserAuth);
