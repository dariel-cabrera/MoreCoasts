import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/shema/user.shema';
import { Configuration } from 'src/configuration/shema/configuration.shema';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Configuration.name) private configurationModel: Model<Configuration>,
  ) {}

  async onApplicationBootstrap() {
    console.log('🚀 Ejecutando operación de seed...');
    await this.seedAdminUser();
    await this.datosConfiguracion()
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
  async datosConfiguracion(){
    try {
      const existingConfig = await this.configurationModel.findOne();
      if (existingConfig) {
        console.log('⚠️ Los datos de configuración ya existen.');
        return;
      }

      const configuracion = new this.configurationModel({
        densidad_aMax: 3000,
        densidad_aMin: 1000,
        densidad_mMin: 900,
        densidad_mMax: 1500,
        indiceMax: 2,
        indiceMin: 0,
        coeficienteMax: 1,
        coeficienteMin: 0,
        alturaMax: 20,
        alturaMin: 0,
        anguloMax: 180,
        anguloMin: 0,
        aceleracionMax: 9.90,
        aceleracionMin: 9.70,
        PMax: 100000000,
        PMin: 0,
      });

      await configuracion.save();
      console.log('✅ Datos de configuración creados con éxito.');
    } catch (error) {
      console.error('❌ Error al crear los datos de configuración:', error);
    }
  }
}


