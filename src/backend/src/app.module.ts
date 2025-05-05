import { Module } from '@nestjs/common';
import { CalculoModule } from './calculo/calculo.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TrazasModule } from './trazas/trazas.module';
import { DatabaseModule } from './shared/database/database.module';
import { UbicacionModule } from './ubicacion/ubicacion.module';
import * as dotenv from 'dotenv';
import { SeedService } from './shared/database/admin.seeder';
import { ReportesModule } from './report/report.module';
dotenv.config();
@Module({
  imports: [
   DatabaseModule,
   CalculoModule,
   AuthModule,
   UserModule,
   TrazasModule,
   UbicacionModule,
   ReportesModule,
   MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  providers: [SeedService],
  
})
export class AppModule {}
