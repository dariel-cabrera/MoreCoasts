import { Body, Controller,Get, Delete, Param,Post,UseGuards, Req } from '@nestjs/common';
import { UbicacionService } from './ubicacion.service';
import { UbicacionDto } from './dto/ubicacion.dto';
import { Request } from 'express';


@Controller()
export class UbicacionController {
    constructor(
        private readonly ubicacionService: UbicacionService 
      ) {}

    @Get('getUbicaciones')
          async getAllTrazas(){
            return this.ubicacionService.getUbicaciones();
    }

   
   @Post('postUbicacion')
        async postTrazas(@Body()ubicacion:UbicacionDto){
        
        return this.ubicacionService.createUbicacion(ubicacion)
    } 

    @Delete('deleteUbicacion/:id')
      async deleteTrazas(@Param('id') id:string){
        
        return this.ubicacionService.deleteUbicacion(id)
    }
       
}