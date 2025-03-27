import { Module } from "@nestjs/common";
import { CalculoController } from "./calculo.controller";
import { CalculoService } from "./calculo.service";
import { MongooseModule } from '@nestjs/mongoose';
import { Calculation,CalculationSchema } from "./shema/datos.schema";
import { TrazasModule } from 'src/trazas/trazas.module';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: Calculation.name, schema:  CalculationSchema }]),
    TrazasModule
  ],
   controllers:[CalculoController],
   providers:[CalculoService],
  
})

export class CalculoModule{}