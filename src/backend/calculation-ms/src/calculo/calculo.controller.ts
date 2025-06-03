import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CalculoService } from './calculo.service';
import { CreateCalculoDto } from './dto/createCalculo.dto';
import { UpdateCalculoDto } from './dto/updateCalculo.dto';

@Controller()
export class CalculoController {
  constructor(private readonly calculoService: CalculoService) {}

  @MessagePattern('create_calculo')
  create(@Payload() calculo: CreateCalculoDto) {
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

    return this.calculoService.createCalculo(
      densidad_a,
      densidad_m,
      indice,
      coeficiente,
      altura,
      angulo,
      aceleracion,
      P,
      ubicacion,
    );
  }

  @MessagePattern('update_calculo')
  update(@Payload() calculo: UpdateCalculoDto) {
    const {
      id,
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
    );
  }

  @MessagePattern('delete_calculo')
  delete(@Payload() data: { _id: string;  }) {
    return this.calculoService.deleteCalculo(data._id);
  }

  @MessagePattern('get_calculo')
  findAll() {
    return this.calculoService.getCalculo();
  }

  @MessagePattern('get_locations')
  getLocations() {
    return this.calculoService.getLocations();
  }

  @MessagePattern('filter_calculos')
  filter(@Payload() filters: any) {
    return this.calculoService.findAll(filters);
  }

  @MessagePattern('get_q_range')
  getQByDateRange(@Payload() filters: any) {
    return this.calculoService.getQByDateRange(filters);
  }

  @MessagePattern('get_p_range')
  getPByDateRange(@Payload() filters: any) {
    return this.calculoService.getPByDateRange(filters);
  }

  @MessagePattern('get_k_range')
  getKByDateRange(@Payload() filters: any) {
    return this.calculoService.getKByDateRange(filters);
  }
}
