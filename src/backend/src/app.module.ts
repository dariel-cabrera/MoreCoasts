import { Module } from '@nestjs/common';
import { CalculoModule } from './calculo/calculo.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TrazasModule } from './trazas/trazas.module';
import * as dotenv from 'dotenv';

dotenv.config();
@Module({
  imports: [CalculoModule,
   AuthModule,
   UserModule,
   TrazasModule,
   MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  
})
export class AppModule {}
