import { Body, Controller, Delete, Get, Post, Put,Param} from '@nestjs/common';
import { CalculoService } from "./calculo.service";
import { CreateCalculoDto } from './dto/createCalculo.dto';
import { UpdateCalculoDto } from './dto/updateCalculo.dto';

@Controller()
export class CalculoController {
      calculoService: CalculoService;
  
      constructor(calculoService: CalculoService){
        this.calculoService= calculoService;
        
      }

      @Get('getCalculation')
      async getAllCalculos(){
        return this.calculoService.getCalculo();
      }

      @Post('postCalculation')
      async createCalculos(@Body() calculo: CreateCalculoDto){
        const {
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
          idUser
        } = calculo;
        return this.calculoService.createCalculo(
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
          idUser
        );
      }
      @Put('updateCalculation/:id')
      async updateCalculos(@Param('id') id:string, @Body() calculo:UpdateCalculoDto){
        const {
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
          idUser
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
          Q,
          P,
          K,
          idUser
        );
      }

     

      @Delete('deleteCalculation/:id')
      async deleteCalculos(@Param('id') id: string,@Body() idUser:string){
        return this.calculoService.deleteCalculo(id,idUser);
      }
	}