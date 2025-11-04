import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { VALIDATION_MESSAGES } from 'src/constants/constants';

export class RegisterDTO {
  @IsNotEmpty({ message: VALIDATION_MESSAGES.NAME_REQUIRED })
  @IsString({ message: VALIDATION_MESSAGES.NAME_STRING })
  name: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.EMAIL_REQUIRED })
  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
  email: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.PASSWORD_REQUIRED })
  @IsString({ message: VALIDATION_MESSAGES.PASSWORD_STRING })
  @MinLength(8, { message: VALIDATION_MESSAGES.PASSWORD_TOO_SHORT })
  @MaxLength(20, { message: VALIDATION_MESSAGES.PASSWORD_TOO_LONG })
  @Matches(/^(?=.*[a-z])/, { message: VALIDATION_MESSAGES.PASSWORD_LOWERCASE })
  @Matches(/^(?=.*[A-Z])/, { message: VALIDATION_MESSAGES.PASSWORD_UPPERCASE })
  @Matches(/^(?=.*\d)/, { message: VALIDATION_MESSAGES.PASSWORD_NUMBER })
  @Matches(/^(?=.*[!@#$%^&*()_\-+={}[\]|:;"'<>,.?/])/, { message: VALIDATION_MESSAGES.PASSWORD_SPECIAL })
  password: string;
}

export class LoginDTO {
    @IsNotEmpty({ message: VALIDATION_MESSAGES.EMAIL_REQUIRED })
    @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
    email: string;
  
    @IsNotEmpty({ message: VALIDATION_MESSAGES.PASSWORD_REQUIRED })
    @IsString({ message: VALIDATION_MESSAGES.PASSWORD_STRING })
    password: string;
}
