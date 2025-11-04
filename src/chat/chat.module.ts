import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat-gateway/chat.gateway';
import { Chat, ChatSchema } from './shema/chat.shema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { FirebaseAdminService } from 'src/firebase/firebase-admin.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    JwtModule.register({}),
    ConfigModule, UserModule],
  providers: [ChatService, ChatGateway, FirebaseAdminService],
  controllers: [ChatController],
})
export class ChatModule {}