import { Body, Controller,Get, Delete, Param,Post,UseGuards, Req, Query } from '@nestjs/common';
import { TrazasService } from './trazas.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';


@Controller()
export class TrazasController {
      trazasService:TrazasService;
      constructor( trazasService:TrazasService){
        this.trazasService=trazasService;
    }

    @Get('getTrazas')
          async getAllTrazas(){
            return this.trazasService.getTrazas();
    }

     @Get('getUsers')
          async getAllUsers(){
            return this.trazasService.getUsers();
    }

    @Get('getfiltrosTrazas')
    async getCalculations(
      @Query('fechaInicio') fechaInicio?: string,
      @Query('fechaFin') fechaFin?: string,
      @Query('users') users?: string
    ) {
      // Validación de fechas
      if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
        throw new Error('La fecha de inicio no puede ser mayor a la fecha fin');
      }
    
      
      return this.trazasService.findAll({
          fechaInicio,
          fechaFin,
          users
         });
    }


   @UseGuards(JwtAuthGuard) // Asegura que el token sea válido
   @Post('postTrazas/:accion')
        async postTrazas(@Param('accion') accion:string,@Req() request: Request){
        const idUser = request['userId']; // Extrae el ID del usuario del request
        return this.trazasService.createTrazas(accion, idUser);
    } 

    @Delete('deleteTrazas/:id')
      async deleteTrazas(@Param('id') id:string){
        
        return this.trazasService.deleteTrazas(id)
    }
       
}