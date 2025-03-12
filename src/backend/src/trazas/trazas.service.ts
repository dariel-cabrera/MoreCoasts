import { Injectable } from "@nestjs/common";
import { Trazas } from "./shema/trazas.shema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class TrazasService{
  constructor(
    @InjectModel(Trazas.name) private readonly datosModel: Model<Trazas>,
  ) {}
  
  // Obtener todos los registros
    async getTrazas(): Promise<Trazas[]> {
      return await this.datosModel.find().exec();
  
    }
  async createTrazas (
    user_name:string,
    accion:string,
    fecha:Date,
  ): Promise<Trazas>{
    const nuevoDato= new this.datosModel({
        user_name,
        accion,
        fecha
    });
    return await nuevoDato.save();
  }

  
  // Eliminar un registro
  async deleteTrazas(id: string): Promise<any> {
    return await this.datosModel.deleteOne({ _id: id });
  }
}