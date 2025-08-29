import { Module } from '@nestjs/common';
import { envs } from './config';
import { MongooseModule } from '@nestjs/mongoose';

import { CalculoModule } from './calculo/calculo.module';

@Module({
  imports: [CalculoModule,
   MongooseModule.forRoot(envs.mongo_url),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
