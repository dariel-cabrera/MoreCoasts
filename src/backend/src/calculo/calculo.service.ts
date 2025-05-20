import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Calculation } from "./shema/datos.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { TrazasService } from 'src/trazas/trazas.service';
import { ReporteExcelService } from "./reporte/ReporteExcel.service";
import { format } from 'date-fns';
import { EcuacionesService } from "./ecuaciones/ecuaciones.service";

@Injectable()
export class CalculoService {
  constructor(
    @InjectModel(Calculation.name) private readonly datosModel: Model<Calculation>,
    private readonly trazasService: TrazasService,
    private readonly ecuacionesService: EcuacionesService,
    private readonly reporteExcel: ReporteExcelService,
  ) {}

  private calcularQyK(params: {
    densidad_a: number;
    densidad_m: number;
    indice: number;
    coeficiente: number;
    altura: number;
    angulo: number;
    aceleracion: number;
    P: number;
  }) {
    const Q = this.ecuacionesService.calculationQ(
      params.densidad_a,
      params.densidad_m,
      params.indice,
      params.coeficiente,
      params.altura,
      params.angulo,
      params.aceleracion
    );
    const K = this.ecuacionesService.calculationK(params.P, Q);
    return { Q, K };
  }

  async createCalculo(
    densidad_a: number,
    densidad_m: number,
    indice: number,
    coeficiente: number,
    altura: number,
    angulo: number,
    aceleracion: number,
    P: number,
    idUser: string,
    ubicacion: string,
  ): Promise<Calculation> {
    const fecha = format(new Date(), 'yyyy-MM-dd');
    const { Q, K } = this.calcularQyK({
      densidad_a, densidad_m, indice, coeficiente, altura, angulo, aceleracion, P,
    });

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
        fecha,
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
    P: number,
    idUser: string,
  ): Promise<Calculation> {
    const { Q, K } = this.calcularQyK({
      densidad_a, densidad_m, indice, coeficiente, altura, angulo, aceleracion, P,
    });

    try {
      await this.trazasService.createTrazas('Ha actualizado un cálculo', idUser);
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

  async exportToExcel() {
    try {
      const calculations = await this.datosModel.find().exec();
      return this.reporteExcel.generar(calculations);
    } catch (error) {
      throw new HttpException('Error al exportar los cálculos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

 async findAll(filters: {
  fechaInicio?: string;
  fechaFin?: string;
  ubicacion?: string;
}) {
  console.log("Filtros recibidos en el servicio:", filters);
  
  const query: any = {};

  // Filtro por ubicación (corregido)
  if (filters.ubicacion && filters.ubicacion.trim() !== '') {
    query.ubicacion = filters.ubicacion.trim();
    console.log("Query después de agregar ubicación:", query);
  }

  // Filtros de fecha (mantén tu lógica actual pero añade logs)
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
        fechaFin.setDate(fechaFin.getDate() + 1);
        query.fecha.$lt = fechaFin;
      }
    }

    if (Object.keys(query.fecha).length === 0) {
      delete query.fecha;
    }
  }

  console.log("Query final que se ejecutará:", query);
  return this.datosModel.find(query).exec();
}



  async getLocations() {
    try {
      return await this.datosModel.distinct('ubicacion').exec();
    } catch (error) {
      throw new HttpException('Error al obtener ubicaciones', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
