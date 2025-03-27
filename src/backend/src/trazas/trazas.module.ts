import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { TrazasController } from "./trazas.controller";
import { TrazasService } from "./trazas.service";
import { Trazas, TrazasSchema } from "./shema/trazas.shema";
import { UserModel } from "src/user/user.model";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trazas.name, schema: TrazasSchema }]),
    UserModel
  ],
   controllers:[TrazasController],
   providers:[TrazasService],
   exports:[TrazasService]
})

export class TrazasModule{}