import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CalculoService } from './calculo.service';
import { CalculoController } from './calculo.controller';
import { Calculation, CalculationSchema } from './schema/datos.schema'; // Asegúrate de tener esto
import { EcuacionesService } from './ecuaciones/ecuaciones.service';

@Module({
  imports: [
    // ¡Esta es la parte crucial que falta!
    MongooseModule.forFeature([
      { 
        name: Calculation.name, 
        schema: CalculationSchema 
      }
    ])
  ],
  controllers: [CalculoController],
  providers: [CalculoService,EcuacionesService,],
})
export class CalculoModule {}