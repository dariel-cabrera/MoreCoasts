import { Injectable } from "@nestjs/common";
import { Calculation} from "./shema/datos.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import * as ExcelJS from 'exceljs';

@Injectable()
export class CalculoService{
  constructor(
    @InjectModel(Calculation.name) private readonly datosModel: Model<Calculation>,
  ) {}

 

  // Crear un nuevo registro
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
  ): Promise<Calculation> {
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
    });
    return await nuevoDato.save();
  }

  // Actualizar un registro existente
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
  ): Promise<Calculation> {
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
      { new: true }, // Retornar el documento actualizado
    );
  }

  // Eliminar un registro
  async deleteCalculo(id: string): Promise<any> {
    return await this.datosModel.deleteOne({ _id: id });
  }

  // Obtener todos los registros
  async getCalculo(): Promise<Calculation[]> {
    return await this.datosModel.find().exec();

  }

 
  /* async exportToExcel(): Promise<Buffer> {
    try {
      const calculations = await this.datosModel.find().exec();
      console.log('Calculations:', calculations);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Calculations');

      worksheet.columns = [
        { header: 'Densidad A', key: 'densidad_a', width: 30 },
        { header: 'Densidad M', key: 'densidad_m', width: 30 },
        { header: 'Índice', key: 'indice', width: 30 },
        { header: 'Coeficiente', key: 'coeficiente', width: 30 },
        { header: 'Altura', key: 'altura', width: 30 },
        { header: 'Ángulo', key: 'angulo', width: 30 },
        { header: 'Q', key: 'Q', width: 30 },
        { header: 'P', key: 'P', width: 30 },
        { header: 'K', key: 'K', width: 30 },
      ];

      calculations.forEach((calculation) => {
        worksheet.addRow(calculation);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      console.log('Buffer created');
      return buffer;
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  } */

}