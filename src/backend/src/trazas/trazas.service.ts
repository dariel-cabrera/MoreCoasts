import { Injectable,UseGuards,Req, HttpException, HttpStatus } from "@nestjs/common";
import { Trazas } from "./shema/trazas.shema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/user/shema/user.shema";



@Injectable()
export class TrazasService{

  constructor(
    @InjectModel(Trazas.name) private readonly datosModel: Model<Trazas>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    
  ) {
    
  }
  

  // Obtener todos los registros
    async getTrazas(): Promise<Trazas[]> {
      return await this.datosModel.find().exec();
  
    }

  
  async createTrazas (
    accion:string,
    idUser: string
  ): Promise<Trazas>{
    const user = await this.userModel.findOne({ _id:idUser });
    if(!user){
      throw new Error('Usuario no encontrado');
    }
    const nuevoDato= new this.datosModel({
        user_name:user.user_name,
        name:user.name,
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

  async getUsers() {
      try {
        return await this.datosModel.distinct('user_name').exec();
      } catch (error) {
        throw new HttpException('Error al obtener ubicaciones', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

   async findAll(filters: {
    fechaInicio?: string;
    fechaFin?: string;
    users?: string;
}) {
  const query: any = {};

  if (filters.fechaInicio || filters.fechaFin) {
    query.fecha = {};

    if (filters.fechaInicio) {
      const fechaInicio = new Date(filters.fechaInicio);
      if (!isNaN(fechaInicio.getTime())) {
        query.fecha.$gte = fechaInicio;
      }
    }

    if (filters.fechaFin) {
      const fechaFin = new Date(filters.fechaFin);
      if (!isNaN(fechaFin.getTime())) {
        // Sumamos un día para incluir la fecha completa
        fechaFin.setDate(fechaFin.getDate() + 1);
        query.fecha.$lt = fechaFin;
      }
    }

    // Eliminar query.fecha si quedó vacío
    if (Object.keys(query.fecha).length === 0) {
      delete query.fecha;
    }
  }

  if (filters.users) {
    query.users = { $regex: new RegExp(filters.users, 'i') };
  }

  try {
    return await this.datosModel.find(query).sort({ fecha: -1 }).exec();
  } catch (error) {
    throw new HttpException('Error al filtrar las trazas', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  


}