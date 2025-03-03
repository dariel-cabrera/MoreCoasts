import { IsEmail, IsNotEmpty, MinLength, Matches, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
class AttributesDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

class DataDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @ValidateNested()
  @Type(() => AttributesDto)
  @IsNotEmpty()
  attributes: AttributesDto;
}

export class LoginDto {
  @ValidateNested()
  @Type(() => DataDto)
  @IsNotEmpty()
  data: DataDto;
}
export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/, {
    message: 'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número',
  })
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  token: string;

  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @IsNotEmpty()
  password_confirmation: string;
}
