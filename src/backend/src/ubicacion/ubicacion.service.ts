import { Injectable } from "@nestjs/common";
import { Ubicacion } from "./shema/ubicacion.shema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";




@Injectable()
export class UbicacionService{

  constructor(
    @InjectModel(Ubicacion.name) private readonly datosModel: Model<Ubicacion>, 
  ) {
    
  }
  

  // Obtener todos los registros
    async getUbicaciones(): Promise<Ubicacion[]> {
      return await this.datosModel.find().exec();
  
    }

  async createUbicacion (
    nombre:string,
    ciudad:string,
    poligono:number[][]
  ): Promise<Ubicacion>{
    
    const nuevoDato= new this.datosModel({
       nombre:nombre,
       ciudad:ciudad,
       poligono:poligono
    });
    return await nuevoDato.save();
  }

  
  // Eliminar un registro
  async deleteUbicacion(id: string): Promise<any> {
    return await this.datosModel.deleteOne({ _id: id });
  }

  


}