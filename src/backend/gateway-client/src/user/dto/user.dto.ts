import { IsString, IsEmail, IsOptional, IsNumber, MinLength, Matches, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly user_name: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly rol: string;

  @IsString()
  @IsNotEmpty()
  readonly lastname: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/, {
    message: 'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número',
  })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly ci:string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly user_name: string;

  @IsNotEmpty()
  @IsString()
  readonly rol: string;

  @IsNotEmpty()
  @IsString()
  readonly lastname: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  password?: string;

  
}
