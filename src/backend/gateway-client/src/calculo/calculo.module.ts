import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices'; // ¡Importación faltante!
import { CALCULATION_SERVICE } from 'src/config';
import { CalculoController } from './calculo.controller';
import { envs } from 'src/config';
@Module({
  controllers: [CalculoController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: CALCULATION_SERVICE,
        transport: Transport.TCP, 
        options: { 
          host: envs.calculationMicroserviceHost, 
          port: envs.calculationMicroservicePort
        }
      }
    ])
  ]
})
export class CalculoModule {}