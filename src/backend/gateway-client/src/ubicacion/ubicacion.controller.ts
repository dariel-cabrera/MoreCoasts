import { Body, Controller,Get, Delete, Param,Post,UseGuards, Req, Put } from '@nestjs/common';
import { UbicacionService } from './ubicacion.service';
import { UbicacionDto } from './dto/ubicacion.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request, Response } from 'express';

@Controller()
export class UbicacionController {
    constructor(
        private readonly ubicacionService: UbicacionService 
      ) {}

    @Get('getUbicaciones')
          async getAllUbicaciones(){
            return this.ubicacionService.getUbicaciones();
    }

    @Get('getCiudades')
    async getCiudades() {
      return this.ubicacionService.getCiudades();
    }

   @UseGuards(JwtAuthGuard) // Asegura que el token sea válido
   @Post('postUbicacion')
        async postTrazas(@Body()ubicacion:UbicacionDto,@Req() request: Request){
        const idUser = request['userId'];
        return this.ubicacionService.createUbicacion(ubicacion,idUser)
    } 

    @UseGuards(JwtAuthGuard) // Asegura que el token sea válido
    @Delete('deleteUbicacion/:id')
      async deleteTrazas(@Param('id') id:string,@Req() request: Request){
         const idUser = request['userId'];
        return this.ubicacionService.deleteUbicacion(id,idUser)
    }

    @UseGuards(JwtAuthGuard) // Asegura que el token sea válido
    @Put('updateUbicacion/:id')
    async updateUbicacion( 
       @Param('id') id:string, 
       @Body() ubicacion:UbicacionDto,
       @Req() request: Request){
       const idUser = request['userId'];
       return this.ubicacionService.updateUbicacion(id,ubicacion,idUser);

       }
       
}