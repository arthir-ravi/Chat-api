import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserDocument, Users } from 'src/authentication/shema/auth.shema';

@Injectable()
export class UserService {
  constructor(@InjectModel(Users.name) private readonly userModel: Model<UserDocument>) {}

  async findAllUsers(): Promise<Users[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findByEmail(email: string): Promise<Users | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(name: string, email: string, password: string): Promise<Users> {
    const hashedPassword = await bcrypt.hash(password, 10); 
    return this.userModel.create({ name, email, password: hashedPassword });
  }

  async getUserFcmToken(userId: string): Promise<string | null> {
    const user = await this.userModel.findById(userId).select('fcmToken');
    return user?.fcmToken || null;
  }

  async updateFcmToken(userId: string, fcmToken: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { fcmToken },
      { new: true },
    ).exec();
  }
}