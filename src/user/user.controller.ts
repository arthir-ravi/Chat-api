import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    const users = await this.userService.findAllUsers();
    return {
      success: true,
      message: 'Users fetched successfully',
      statusCode: 200,
      data: users,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-fcm')
  async updateFcm(@Req() req, @Body('fcmToken') fcmToken: string) {
    console.log('User from token:', req.user);
    console.log('Received FCM Token:', fcmToken);

    const userId = req.user.userId;
    console.log('Attempting to update FCM token for userId:', userId);

    const updatedUser = await this.userService.updateFcmToken(userId, fcmToken);

    console.log('Updated User:', updatedUser);
    return { success: true, message: 'FCM token updated successfully' };
  }
}