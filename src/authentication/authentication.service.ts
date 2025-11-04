import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { LoginDTO, RegisterDTO } from './dto/create-authentication.dto';
import { AUTH_MESSAGES } from 'src/constants/constants';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDTO) {
    const { name, email, password } = dto;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) throw new BadRequestException(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);

    const user = await this.usersService.createUser(name, email, password);
    if (!user) throw new BadRequestException(AUTH_MESSAGES.USER_CREATION_FAILED);

    const token = this.jwtService.sign(
      {
        sub: user._id,
        email: user.email,
        name: user.name,
      },
    );

    return {
      success: true,
      message: AUTH_MESSAGES.REGISTER_SUCCESS,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        access_token: token,
      },
    };
  }

  async login(dto: LoginDTO) {
    const { email, password } = dto;
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);

    const token = this.jwtService.sign(
      {
        sub: user._id,
        email: user.email,
        name: user.name,
      },
    );

    return {
      success: true,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data: { 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        access_token: token,
      },
    };
  }
}