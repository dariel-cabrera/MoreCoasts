import { Injectable, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { Configuration} from "./shema/configuration.shema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";


@Injectable()
export class ConfigurationService {
  constructor(
    @InjectModel(Configuration.name) private readonly datosModel: Model<Configuration>,
    
  ) {}

  async createConfiguration(
    densidad_aMax: number,
    densidad_mMax: number,
    densidad_aMin: number,
    densidad_mMin: number,
    indiceMax: number,
    coeficienteMax: number,
    indiceMin: number,
    coeficienteMin: number,
    alturaMax: number,
    anguloMax: number,
    alturaMin: number,
    anguloMin: number,
    aceleracionMax: number,
    PMax: number,
    aceleracionMin: number,
    PMin: number,

  ): Promise<Configuration> {

    
   
    try {
      const nuevoDato = new this.datosModel({
        densidad_aMax,
        densidad_mMax,
        densidad_aMin,
        densidad_mMin,
        indiceMax,
        coeficienteMax,
        indiceMin,
        coeficienteMin,
        alturaMax,
        anguloMax,
        alturaMin,
        anguloMin,
        aceleracionMax,
        PMax,
        aceleracionMin,
        PMin,
      });
      
      return await nuevoDato.save();
    } catch (error) {
      throw new HttpException('Error al crear la configuracion', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateConfiguration(
    id: string,
    densidad_aMax: number,
    densidad_mMax: number,
    densidad_aMin: number,
    densidad_mMin: number,
    indiceMax: number,
    coeficienteMax: number,
    indiceMin: number,
    coeficienteMin: number,
    alturaMax: number,
    anguloMax: number,
    alturaMin: number,
    anguloMin: number,
    aceleracionMax: number,
    PMax: number,
    aceleracionMin: number,
    PMin: number,
  ): Promise<Configuration> {
    try {
      
      return await this.datosModel.findByIdAndUpdate(
        id,
        {
          $set: {
            densidad_aMax,
            densidad_mMax,
            densidad_aMin,
            densidad_mMin,
            indiceMax,
            coeficienteMax,
            indiceMin,
            coeficienteMin,
            alturaMax,
            anguloMax,
            alturaMin,
            anguloMin,
            aceleracionMax,
            PMax,
            aceleracionMin,
            PMin,
          },
        },
        { new: true },
      );
    } catch (error) {
      throw new HttpException('Error al actualizar la configuracion', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getConfiguration(): Promise<Configuration[]> {
    try {
      return await this.datosModel.find().exec();
    } catch (error) {
      throw new HttpException('Error al obtener los cálculos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

 
}