import { Controller, Post, Body, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🔐 Endpoint para iniciar sesión
@Post('login')
@HttpCode(HttpStatus.OK)
async login(@Body() LoginDto: { data: { type: string; attributes: { user_name: string; password: string } } }) {
  const { type, attributes } = LoginDto.data;

  console.log('Datos recibidos del frontend:', LoginDto);

  // Validar que el tipo sea 'token'
  if (type !== 'token') {
    throw new HttpException('Tipo de datos no válido', HttpStatus.BAD_REQUEST);
  }

  // Extraer user_name y password de attributes
  const { user_name, password } = attributes;

  // Llamar al servicio con los datos extraídos
  return this.authService.login(user_name, password);
}

/*
  // 📝 Endpoint para registrar un nuevo usuario
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.name, registerDto.email, registerDto.password);
  }

  // 🔁 Endpoint para solicitar cambio de contraseña
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  // 🔄 Endpoint para restablecer la contraseña
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.token,
      resetPasswordDto.password,
      resetPasswordDto.password_confirmation,
    );
  }
    */
}
