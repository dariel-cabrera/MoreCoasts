import { Injectable, NotFoundException,HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './shema/user.shema';
import * as bcrypt from 'bcrypt';
import { PasswordReset, PasswordResetDocument } from './shema/password-reset.schema';
import { isEmail } from 'class-validator';


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
    const { user_name,name, rol, lastname, email, password, ci } = userData;

    // Validar campos obligatorios
    if (!name || !user_name || !lastname || !email || !password || !ci || ! rol) {
        throw new HttpException('Faltan campos obligatorios', HttpStatus.BAD_REQUEST);
    }

    // 2. Validar formatos
    if (!isEmail(email)) {
      throw new HttpException('Email inválido', HttpStatus.BAD_REQUEST);
    }
    if (!/^\d{11}$/.test(ci)) {
      throw new HttpException('CI inválido', HttpStatus.BAD_REQUEST);
    }
    if (password.length < 8) {
      throw new HttpException('La contraseña debe tener al menos 8 caracteres', HttpStatus.BAD_REQUEST);
    }

    // Verificar duplicados en una sola consulta
    const existingUser = await this.userModel.findOne({
        $or: [
            { user_name },
            { ci },
            { email }
        ]
    });

    if (existingUser) {
        if (existingUser.user_name === user_name) {
            throw new HttpException('El nombre de usuario ya está registrado', HttpStatus.CONFLICT);
        }
        if (existingUser.ci === ci) {
            throw new HttpException('El CI ya está registrado', HttpStatus.CONFLICT);
        }
        if (existingUser.email === email) {
            throw new HttpException('El email ya está registrado', HttpStatus.CONFLICT);
        }
    }

    // Encriptar contraseña y guardar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new this.userModel({
        user_name,
        name,
        rol,
        lastname,
        ci,
        email,
        password: hashedPassword,
        created_at: new Date()
    });
    
    return newUser.save();
}


   async update(
      id: string,
      user_name: string,
      name: string,
      rol:string,
      last_name: string,
      email: string,
    
    ): Promise<User> {
      return await this.userModel.findByIdAndUpdate(
        id,
        {
          $set: {
            user_name,
            name,
            rol,
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
