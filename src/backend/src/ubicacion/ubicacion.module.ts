import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { UbicacionService } from "./ubicacion.service";
import { UbicacionController } from "./ubicacion.controller";
import { Ubicacion, UbicacionSchema } from "./shema/ubicacion.shema";
import { TrazasModule } from "src/trazas/trazas.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ubicacion.name, schema: UbicacionSchema }]),
    TrazasModule,
    AuthModule

  ],
   controllers:[UbicacionController],
   providers:[ UbicacionService],
   exports:[ UbicacionService]
})

export class UbicacionModule{}