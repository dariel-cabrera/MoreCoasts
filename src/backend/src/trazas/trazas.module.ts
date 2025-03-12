import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { TrazasController } from "./trazas.controller";
import { TrazasService } from "./trazas.service";
import { Trazas, TrazasSchema } from "./shema/trazas.shema";


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trazas.name, schema: TrazasSchema }])
  ],
   controllers:[TrazasController],
   providers:[TrazasService],
})

export class TrazasModule{}