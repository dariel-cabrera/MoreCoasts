import { Module } from '@nestjs/common';
import { CalculoModule } from './calculo/calculo.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [CalculoModule,
   MongooseModule.forRoot("mongodb://localhost:27017/MoreCoast")
  ],
  
})
export class AppModule {}
