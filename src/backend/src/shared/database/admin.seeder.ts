import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/shema/user.shema';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async onApplicationBootstrap() {
    console.log('🚀 Ejecutando operación de seed...');
    await this.seedAdminUser();
  }

  async seedAdminUser() {
    try {
      const existingUser = await this.userModel.findOne({ email: 'admin@jsonapi.com' });
      if (existingUser) {
        console.log('⚠️ El usuario administrador ya existe.');
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('secret', salt);

      const user = new this.userModel({
        user_name: 'Admin',
        rol:'admin',
        name: 'Admin',
        lastname: 'Admin',
        ci: '0000000000',
        email: 'admin@jsonapi.com',
        password: hashedPassword,
        created_at: new Date(),
      });

      await user.save();
      console.log('✅ Usuario administrador creado con éxito.');
    } catch (error) {
      console.error('❌ Error creando el usuario administrador:', error);
    }
  }
}

