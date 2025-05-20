import { Body, Controller, Delete, Get, Post, Put, Param, UseGuards, Req, Res, Query } from '@nestjs/common';

import { CalculoService } from "./calculo.service";
import { CreateCalculoDto } from './dto/createCalculo.dto';
import { UpdateCalculoDto } from './dto/updateCalculo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request, Response } from 'express';


@Controller()
export class CalculoController {
  constructor(private readonly calculoService: CalculoService) {}

    @Get('getCalculation')
     async getAllCalculos(){
        return this.calculoService.getCalculo();
    }

    @Get('getfiltrosCalculation')
    async getCalculations(
      @Query('fechaInicio') fechaInicio?: string,
      @Query('fechaFin') fechaFin?: string,
      @Query('ubicacion') ubicacion?: string
    ) {
      // Validación de fechas
      if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
        throw new Error('La fecha de inicio no puede ser mayor a la fecha fin');
      }
       console.log('Controller',ubicacion,fechaFin,fechaInicio);
      return this.calculoService.findAll({
        fechaInicio,
        fechaFin,
        ubicacion
      });
    }


    @Get('getLocations')
    async getLocations() {
      return this.calculoService.getLocations();
    }

      

      @UseGuards(JwtAuthGuard) // Asegura que el token sea válido
      @Post('postCalculation')
     

      async createCalculos(@Body() calculo: CreateCalculoDto,@Req() request: Request){
        const {
          densidad_a,
          densidad_m,
          indice,
          coeficiente,
          altura,
          angulo,
          aceleracion,
          P,
          ubicacion,
          
        } = calculo;
        const idUser = request['userId'];
        return this.calculoService.createCalculo(
          densidad_a,
          densidad_m,
          indice,
          coeficiente,
          altura,
          angulo,
          aceleracion,
          P,
          idUser,
          ubicacion
        );
      }
      @UseGuards(JwtAuthGuard) // Asegura que el token sea válido
      @Put('updateCalculation/:id')
      async updateCalculos(

        @Param('id') id:string, 
        @Body() calculo:UpdateCalculoDto,
        @Req() request: Request){

        const idUser = request['userId'];
        const {
          densidad_a,
          densidad_m,
          indice,
          coeficiente,
          altura,
          angulo,
          aceleracion,
          P,
        } = calculo;
       
        return this.calculoService.updateCalculo(
          id,
          densidad_a,
          densidad_m,
          indice,
          coeficiente,
          altura,
          angulo,
          aceleracion,
          P,
          idUser
        );
      }

     
      @UseGuards(JwtAuthGuard) // Asegura que el token sea válido
      @Delete('deleteCalculation/:id')
      async deleteCalculos(@Param('id') id: string,@Req() request: Request){
        const idUser = request['userId'];
        return this.calculoService.deleteCalculo(id,idUser);
      }

      @Get('export-excel')
      async exportToexcel(@Res() res: Response) {
      try {
        const { buffer, nombreHoja } = await this.calculoService.exportToExcel();

          res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader('Content-Disposition', `attachment; filename=${nombreHoja}.xlsx`);
        res.send(buffer);
      } catch (error) {
        console.error('Error al exportar:', error);
        res.status(500).json({ error: 'Error al generar el reporte' });
      }
      }


	}

  