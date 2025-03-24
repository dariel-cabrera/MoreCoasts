import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './shema/user.shema';
import { PasswordReset, PasswordResetDocument } from './shema/password-reset.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(PasswordReset.name) private passwordResetModel: Model<PasswordResetDocument>,
  ) {}

  /*** 🚀 FUNCIONES DE USUARIO 🚀 ***/

  // Obtener todos los usuarios
  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users;
  }

  // Obtener un usuario por ID
  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Crear un nuevo usuario
  async create(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }


   async update(
      id: string,
      user_name: string,
      name: string,
      last_name: string,
      email: string,
    
    ): Promise<User> {
      return await this.userModel.findByIdAndUpdate(
        id,
        {
          $set: {
            user_name,
            name,
            last_name,
            email,
          },
        },
        { new: true }, // Retornar el documento actualizado
      );
    }
  

  // Eliminar un usuario
  async delete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('User not found');
  }

  /*** 🔐 FUNCIONES DE RESETEO DE CONTRASEÑA 🔐 ***/

  // Crear un nuevo registro de restablecimiento de contraseña
  async createPasswordReset(email: string, token: string): Promise<PasswordReset> {
    const resetEntry = new this.passwordResetModel({ email, token });
    return resetEntry.save();
  }

  // Buscar un token de restablecimiento de contraseña
  async findPasswordResetByEmail(email: string): Promise<PasswordReset | null> {
    return this.passwordResetModel.findOne({ email }).exec();
  }

  // Eliminar un token de restablecimiento de contraseña después de su uso
  async deletePasswordReset(email: string): Promise<void> {
    await this.passwordResetModel.deleteOne({ email }).exec();
  }
}
