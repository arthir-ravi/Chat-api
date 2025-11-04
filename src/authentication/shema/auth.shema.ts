import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = Users & Document;

@Schema()
export class Users {
  _id: string; 
   
  @Prop({required: true})
  name: string

  @Prop({ unique: true, required: true })
  email: string;
  
  @Prop({ required: true })
  password: string; 

  @Prop({ type: String, default: null })
  fcmToken?: string | null;
}

export const UserSchema = SchemaFactory.createForClass(Users);
