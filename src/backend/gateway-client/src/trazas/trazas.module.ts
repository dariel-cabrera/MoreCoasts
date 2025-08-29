import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { TrazasController } from "./trazas.controller";
import { TrazasService } from "./trazas.service";
import { Trazas, TrazasSchema } from "./shema/trazas.shema";
import { UserModule } from "src/user/user.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trazas.name, schema: TrazasSchema }]),
    UserModule,
    AuthModule
  ],
   controllers:[TrazasController],
   providers:[TrazasService],
   exports:[TrazasService]
})

export class TrazasModule{}