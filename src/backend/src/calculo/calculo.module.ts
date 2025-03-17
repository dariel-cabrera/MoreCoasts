import { Module } from "@nestjs/common";
import { CalculoController } from "./calculo.controller";
import { CalculoService } from "./calculo.service";
import { MongooseModule } from '@nestjs/mongoose';
import { DatosSchema } from "./shema/datos.schema";



@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Datos', schema: DatosSchema }])
  ],
   controllers:[CalculoController],
   providers:[CalculoService],
})

export class CalculoModule{}