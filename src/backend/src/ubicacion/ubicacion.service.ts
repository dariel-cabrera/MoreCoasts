import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Ubicacion } from './shema/ubicacion.shema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TrazasService } from 'src/trazas/trazas.service';

@Injectable()
export class UbicacionService {
  constructor(
    @InjectModel(Ubicacion.name) private readonly ubicacionModel: Model<Ubicacion>,
    private readonly trazasService: TrazasService
  ) {}

  async getUbicaciones(): Promise<Ubicacion[]> {
    try {
      return await this.ubicacionModel.find().exec();
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al obtener ubicaciones',
        error: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createUbicacion(ubicacion: any, idUser: string): Promise<Ubicacion> {
    try {
      // Validar nombre único
      const existeUbicacion = await this.ubicacionModel.findOne({ 
        nombre: ubicacion.nombre 
      }).exec();

      if (existeUbicacion) {
        throw new HttpException({
          status: HttpStatus.CONFLICT,
          message: 'El nombre de la ubicación ya está registrado',
          error: 'Conflict'
        }, HttpStatus.CONFLICT);
      }

      const nuevaUbicacion = new this.ubicacionModel({
        nombre: ubicacion.nombre,
        ciudad: ubicacion.ciudad,
        poligono: ubicacion.poligono
      });

      await this.trazasService.createTrazas('Ha creado una Ubicación', idUser);
      return await nuevaUbicacion.save();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al crear la ubicación',
        error: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUbicacion(id: string, idUser: string): Promise<any> {
    try {
      const resultado = await this.ubicacionModel.deleteOne({ _id: id }).exec();
      
      if (resultado.deletedCount === 0) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          message: 'Ubicación no encontrada',
          error: 'Not Found'
        }, HttpStatus.NOT_FOUND);
      }

      await this.trazasService.createTrazas('Ha eliminado una Ubicación', idUser);
      return resultado;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al eliminar la ubicación',
        error: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUbicacion(id: string, ubicacion: any, idUser: string): Promise<Ubicacion> {
    try {
      // Validar nombre único (excepto para el documento actual)
      if (ubicacion.nombre) {
        const existeNombre = await this.ubicacionModel.findOne({
          nombre: ubicacion.nombre,
          _id: { $ne: id }
        }).exec();

        if (existeNombre) {
          throw new HttpException({
            status: HttpStatus.CONFLICT,
            message: 'El nombre de la ubicación ya está en uso',
            error: 'Conflict'
          }, HttpStatus.CONFLICT);
        }
      }

      const ubicacionActualizada = await this.ubicacionModel.findByIdAndUpdate(
        id,
        {
          $set: {
            nombre: ubicacion.nombre,
            ciudad: ubicacion.ciudad,
            poligono: ubicacion.poligono
          },
        },
        { new: true }
      ).exec();

      if (!ubicacionActualizada) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          message: 'Ubicación no encontrada',
          error: 'Not Found'
        }, HttpStatus.NOT_FOUND);
      }

      await this.trazasService.createTrazas('Ha actualizado una Ubicación', idUser);
      return ubicacionActualizada;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al actualizar la ubicación',
        error: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCiudades(): Promise<string[]> {
    try {
      return await this.ubicacionModel.distinct('ciudad').exec();
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al obtener ciudades',
        error: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}