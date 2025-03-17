import { Body, Controller, Delete, Get, Post, Put,Param } from '@nestjs/common';
import { CalculoService } from "./calculo.service";
import { CreateCalculoDto } from './dto/createCalculo.dto';
import { UpdateCalculoDto } from './dto/updateCalculo.dto';

@Controller()
export class CalculoController {
      calculoService: CalculoService;
      constructor(calculoService: CalculoService){
        this.calculoService= calculoService;
      }

      @Get('/calculo')
      async getAllCalculos(){
        return this.calculoService.getCalculo();
      }

      @Post('/calculo')
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
        );
      }
      @Put('/calculo/:id')
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
        );
      }

     

      @Delete('/calculo/:id')
      async deleteCalculos(@Param('id') id: string){
        return this.calculoService.deleteCalculo(id);
      }
	}