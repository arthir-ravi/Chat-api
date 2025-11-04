import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { FirebaseAdminService } from 'src/firebase/firebase-admin.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, Set<string>>();

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {}

  handleConnection(socket: Socket) {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      console.log('Missing token, disconnecting socket...');
      return socket.disconnect();
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET') || 'mysecret';
      const payload = this.jwtService.verify(token, { secret });
      const userId = payload.sub;

      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(socket.id);

      socket.data.user = { id: userId, name: payload.name, email: payload.email };

      console.log(`User connected: ${payload.name} (${userId})`);
      console.log('Verified payload:', payload);
      this.broadcastOnlineUsers();
    } catch (err) {
      console.log('Invalid token, disconnecting socket...');
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    const user = socket.data.user;
    if (!user || !user.id) return;

    const sockets = this.userSockets.get(user.id);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) this.userSockets.delete(user.id);
    }

    console.log(`User disconnected: ${user.name} (${user.id})`);
    this.broadcastOnlineUsers();
  }

  private broadcastOnlineUsers() {
    const onlineUserIds = Array.from(this.userSockets.keys());
    this.server.emit('online_users', onlineUserIds);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { senderId: string; receiverId: string; content: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const sender = socket.data.user;
    if (!sender || !sender.id) {
      return socket.emit('error', { message: 'Unauthorized sender' });
    }

    try {
      const message = await this.chatService.saveMessage(
        sender.id,
        data.receiverId,
        data.content,
      );
      const receiverSockets = this.userSockets.get(data.receiverId);
      if (receiverSockets) {
        receiverSockets.forEach((sockId) => {
          this.server.to(sockId).emit('receive_message', message);
        });
      }
      const receiverToken = await this.userService.getUserFcmToken(data.receiverId);

      if (receiverToken) {
        console.log('Sending push notification to:', receiverToken);
        await this.firebaseAdminService.sendNotification(
          receiverToken,
          'New Message',
          `${sender.name}: ${data.content}`,
        );
      } else {
        console.warn(`No FCM token found for receiver: ${data.receiverId}`);
      }

      socket.emit('message_sent', message);
      console.log(`Message sent from ${sender.name} to ${data.receiverId}`);
    } catch (err) {
      console.error('Error sending message:', err.message);
      socket.emit('error', { message: 'Message delivery failed' });
    }
  }
}