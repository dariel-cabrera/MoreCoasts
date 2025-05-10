import { Injectable, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { Calculation } from "./shema/datos.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import * as ExcelJS from 'exceljs';
import { TrazasService } from 'src/trazas/trazas.service';
import { Response } from 'express';
import { IReporteGenerador} from "src/report/interface/report.interface";
import { format } from 'date-fns';

@Injectable()
export class CalculoService {
  constructor(
    @InjectModel(Calculation.name) private readonly datosModel: Model<Calculation>,
    private readonly trazasService: TrazasService,
    @Inject('IReporteGenerador')
    private readonly reporteGenerador: IReporteGenerador<any>,
  ) {}

  async createCalculo(
    densidad_a: number,
    densidad_m: number,
    indice: number,
    coeficiente: number,
    altura: number,
    angulo: number,
    aceleracion: number,
    Q: number,
    P: number,
    K: number,
    idUser: string,
    ubicacion:string,
    
  ): Promise<Calculation> {

    const formattedDate = format(new Date(), 'yyyy-MM-dd'); // Siempre devuelve string
    console.log(formattedDate); // "2023-12-25" (sin hora)

    try {
      const nuevoDato = new this.datosModel({
        densidad_a,
        densidad_m,
        indice,
        coeficiente,
        altura,
        angulo,
        aceleracion,
        Q,
        P,
        K,
        ubicacion,
        fecha: formattedDate,
      });
      
      await this.trazasService.createTrazas('Ha realizado un cálculo', idUser);
      return await nuevoDato.save();
    } catch (error) {
      throw new HttpException('Error al crear el cálculo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateCalculo(
    id: string,
    densidad_a: number,
    densidad_m: number,
    indice: number,
    coeficiente: number,
    altura: number,
    angulo: number,
    aceleracion: number,
    Q: number,
    P: number,
    K: number,
    idUser: string,
  ): Promise<Calculation> {
    try {
      await this.trazasService.createTrazas('Ha actualizado un Cálculo', idUser);
      return await this.datosModel.findByIdAndUpdate(
        id,
        {
          $set: {
            densidad_a,
            densidad_m,
            indice,
            coeficiente,
            altura,
            angulo,
            aceleracion,
            Q,
            P,
            K,
          },
        },
        { new: true },
      );
    } catch (error) {
      throw new HttpException('Error al actualizar el cálculo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteCalculo(_id: string, idUser: string): Promise<any> {
    try {
      const dato = await this.datosModel.findOne({ _id });
      if (!dato) {
        throw new HttpException('Cálculo no encontrado', HttpStatus.NOT_FOUND);
      }
      
      await this.trazasService.createTrazas('Ha eliminado un cálculo', idUser);
      return await this.datosModel.deleteOne({ _id });
    } catch (error) {
      throw new HttpException('Error al eliminar el cálculo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCalculo(): Promise<Calculation[]> {
    try {
      return await this.datosModel.find().exec();
    } catch (error) {
      throw new HttpException('Error al obtener los cálculos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async exportToexcel(){
    const calculations = await this.datosModel.find().exec();

    const config = {
      nombreHoja: 'Cálculos de Sedimentos',
      columnas: [
        { header: 'ID', key: '_id', width: 25 },
        { header: 'Densidad Aire (kg/m³)', key: 'densidad_a', width: 20 },
        { header: 'Densidad Material (kg/m³)', key: 'densidad_m', width: 20 },
        { header: 'Índice', key: 'indice', width: 15 },
        { header: 'Coeficiente', key: 'coeficiente', width: 15 },
        { header: 'Altura (m)', key: 'altura', width: 15 },
        { header: 'Ángulo (°)', key: 'angulo', width: 15 },
        { header: 'Aceleración (m/s²)', key: 'aceleracion', width: 20 },
        { header: 'Q', key: 'Q', width: 15 },
        { header: 'P', key: 'P', width: 15 },
        { header: 'K', key: 'K', width: 15 },
      ],
      estiloEncabezado: {
        bold: true,
        fillColor: 'FFD3D3D3',
        alignment: { 
          vertical: 'middle' as const,  // Usamos 'as const' para asegurar el tipo literal
          horizontal: 'center' as const // Usamos 'as const' para asegurar el tipo literal
        },
      },
    };
    // Transformar datos si es necesario (ej: _id a string)
    const data = calculations.map(calc => ({
      ...calc.toObject(),
      _id: calc._id.toString(),
    }));

    const buffer= await this.reporteGenerador.generar(data,config);
    return { buffer, nombreHoja: config.nombreHoja}
  }
}