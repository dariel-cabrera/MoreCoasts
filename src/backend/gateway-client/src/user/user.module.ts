import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './shema/user.shema';
import { PasswordReset, PasswordResetSchema } from './shema/password-reset.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema:  UserSchema },
      { name: PasswordReset.name, schema: PasswordResetSchema }, // Registro del schema
    ]),
    
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, MongooseModule], // Exportamos para usarlo en otros módulos
})
export class UserModule {}
