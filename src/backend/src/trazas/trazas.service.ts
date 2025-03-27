import { Injectable } from "@nestjs/common";
import { Trazas } from "./shema/trazas.shema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/user/shema/user.shema";


@Injectable()
export class TrazasService{
  constructor(
    @InjectModel(Trazas.name) private readonly datosModel: Model<Trazas>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  
  // Obtener todos los registros
    async getTrazas(): Promise<Trazas[]> {
      return await this.datosModel.find().exec();
  
    }
  async createTrazas (
    idUser:string,
    accion:string,
  ): Promise<Trazas>{
    const user = await this.userModel.findOne({ _id:idUser });
    const nuevoDato= new this.datosModel({
        user_name:user.name,
        last_name:user.lastname,
        ci:user.ci,
        accion,
        fecha: new Date(),
    });
    return await nuevoDato.save();
  }

  
  // Eliminar un registro
  async deleteTrazas(id: string): Promise<any> {
    return await this.datosModel.deleteOne({ _id: id });
  }


}