import { Module } from '@nestjs/common';
import { CalculoModule } from './calculo/calculo.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TrazasModule } from './trazas/trazas.module';
import { DatabaseModule } from './shared/database/database.module';
import { UbicacionModule } from './ubicacion/ubicacion.module';
import { SeedService } from './shared/database/admin.seeder';
import { ConfigurationModule } from './configuration/configuration.module';
import { envs } from './config';



@Module({
  imports: [
  DatabaseModule,
  CalculoModule,
   AuthModule,
   UserModule,
   TrazasModule,
   UbicacionModule,
   ConfigurationModule,
  MongooseModule.forRoot(envs.mongo_uri)
  ],
  controllers: [],
  providers: [SeedService],
})
export class AppModule {}
