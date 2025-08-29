import { Body, Controller, Delete, Get, Post, Put,Param,UseGuards, Req, Res} from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigurationDto } from './dto/configuration.dto';



@Controller()
export class ConfigurationController {
    configurationService: ConfigurationService;
      
  
      constructor(configurationService: ConfigurationService){
        this.configurationService= configurationService;
      
        
      }

      @Get('getConfiguration')
      async getAllCalculos(){
        return this.configurationService.getConfiguration();
      }

      

      
      @Post('postConfiguration')
      async createConfiguration(@Body() configuration: ConfigurationDto){
        const {
            densidad_aMax,
            densidad_mMax,
            densidad_aMin,
            densidad_mMin,
            indiceMax,
            coeficienteMax,
            indiceMin,
            coeficienteMin,
            alturaMax,
            anguloMax,
            alturaMin,
            anguloMin,
            aceleracionMax,
            PMax,
            aceleracionMin,
            PMin,
          
        } = configuration;
        
        return this.configurationService.createConfiguration(
            densidad_aMax,
            densidad_mMax,
            densidad_aMin,
            densidad_mMin,
            indiceMax,
            coeficienteMax,
            indiceMin,
            coeficienteMin,
            alturaMax,
            anguloMax,
            alturaMin,
            anguloMin,
            aceleracionMax,
            PMax,
            aceleracionMin,
            PMin,
        );
      }
      
      @Put('updateConfiguration/:id')
      async updateConfiguration(

        @Param('id') id:string, 
        @Body() calculo:ConfigurationDto,
       ){

        
        const {
            densidad_aMax,
            densidad_mMax,
            densidad_aMin,
            densidad_mMin,
            indiceMax,
            coeficienteMax,
            indiceMin,
            coeficienteMin,
            alturaMax,
            anguloMax,
            alturaMin,
            anguloMin,
            aceleracionMax,
            PMax,
            aceleracionMin,
            PMin,
          
        } = calculo;
       
        return this.configurationService.updateConfiguration(
          id,
          densidad_aMax,
          densidad_mMax,
          densidad_aMin,
          densidad_mMin,
          indiceMax,
          coeficienteMax,
          indiceMin,
          coeficienteMin,
          alturaMax,
          anguloMax,
          alturaMin,
          anguloMin,
          aceleracionMax,
          PMax,
          aceleracionMin,
          PMin,
        );
      }

     
     

	}