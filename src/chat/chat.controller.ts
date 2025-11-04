import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('messages')
  async getMessages(@Query('receiverId') receiverId: string, @Req() req) {
    const senderId = req.user.userId;
    return this.chatService.getMessages(senderId, receiverId);
  }
}