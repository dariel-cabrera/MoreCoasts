import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class EcuacionesService {
  roundDecimals(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
  }

  calculationQ (
    densidad_a: number,
    densidad_m: number,
    indice: number,
    coeficiente: number,
    altura: number,
    angulo: number,
    aceleracion: number,
  ): number {
    try {
      const N = densidad_a * Math.sqrt(aceleracion);
      const D = 16 * Math.sqrt(indice) * (densidad_a - densidad_m) * (1 - coeficiente);

      if (D === 0) {
        throw new HttpException('División por cero no permitida', HttpStatus.BAD_REQUEST);
      }

      const alturaPotencia = Math.pow(altura, 5);
      const anguloRadianes = angulo * Math.PI / 180
      const seno = Math.sin(2 * anguloRadianes);

      const Q = (N / D) * Math.sqrt(alturaPotencia) * seno;
      
      if (isNaN(Q)) {
            throw new HttpException('Resultado no es un número válido', HttpStatus.BAD_REQUEST);
          }
          
          return this.roundDecimals(Q, 4);
        } catch (error) {
          if (error instanceof HttpException) {
            throw error;
          }
          throw new HttpException('Error en el cálculo', HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  calculationK(
    P:number,
    Q:number
  ):number{

    const K= P/Q
    return this.roundDecimals(K,4);

  }


}
