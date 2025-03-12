import { Body, Controller,Get, Delete, Param,Post} from '@nestjs/common';
import { TrazasService } from './trazas.service';
import { TrazasCreateDto } from './dto/trazas.dto';

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

    @Post('postTrazas')
      async postTrazas(@Body() trazas:TrazasCreateDto){
        const {user_name , accion, fecha}=trazas
          return this.trazasService.createTrazas(user_name,accion,fecha);
    }

    @Delete('deleteTrazas/:id')
      async deleteTrazas(@Param('id') id:string){
          return this.trazasService.deleteTrazas(id)
      }
       
}