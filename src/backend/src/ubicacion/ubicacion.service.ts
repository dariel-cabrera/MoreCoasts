import { HttpException, Injectable, HttpStatus } from "@nestjs/common";
import { Ubicacion } from "./shema/ubicacion.shema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { TrazasService } from "src/trazas/trazas.service";



@Injectable()
export class UbicacionService{

  constructor(
    @InjectModel(Ubicacion.name) private readonly datosModel: Model<Ubicacion>, 
    private readonly trazasService: TrazasService
  ) {
    
  }
  

  // Obtener todos los registros
    async getUbicaciones(): Promise<Ubicacion[]> {
      return await this.datosModel.find().exec();
  
    }

  async createUbicacion (
    ubicacion,idUser
  ): Promise<Ubicacion>{
    
    
    
  // Si usas la solución con @Transform, puedes usar directamente:
  // const poligonoFormateado = ubicacionDto.poligono;
  
  const nuevoDato = new this.datosModel({
      nombre: ubicacion.nombre,
      ciudad: ubicacion.ciudad,
      poligono: ubicacion.poligono
  });
    await this.trazasService.createTrazas('Ha creado una Ubicación', idUser);
    return await nuevoDato.save();
  }

  
  // Eliminar un registro
  async deleteUbicacion(id: string,idUser:string): Promise<any> {
    await this.trazasService.createTrazas('Ha eliminado una Ubicación', idUser);
    return await this.datosModel.deleteOne({ _id: id });
  }

  async updateUbicacion(id:string,ubicacion,idUser):Promise<any>{
    try {
          await this.trazasService.createTrazas('Ha actualizado una Ubicación', idUser);
          return await this.datosModel.findByIdAndUpdate(
            id,
            {
              $set: {
                nombre:ubicacion.nombre,
                ciudad:ubicacion.ciudad,
                poligono:ubicacion.poligono
                
              },
            },
            { new: true },
          );
        } catch (error) {
          throw new HttpException('Error al actualizar el cálculo', HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  


}