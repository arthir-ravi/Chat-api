import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './shema/chat.shema';
import { UserDocument } from 'src/authentication/shema/auth.shema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>,) {}

  async saveMessage(senderId: string, receiverId: string, content: string) {
    const message = new this.chatModel({ senderId, receiverId, content });
    await message.save();
    return message.populate('senderId', 'name email');
  }

  async getMessages(senderId: string, receiverId: string) {
    return this.chatModel
      .find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .exec();
  }
}