import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly user_name: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly lastname: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly ci:string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly user_name?: string;

  @IsOptional()
  @IsString()
  readonly lastname?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  
}
