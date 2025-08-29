import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
  Put,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CALCULATION_SERVICE } from 'src/config';
import { CreateCalculoDto } from './dto/create.dto';
import { UpdateCalculoDto } from './dto/update.dto';
import { FilterCalculoDto } from './dto/filter.dto';
import { createBreaker } from 'src/shared/circuit-breaker/circuit-breaker.service';
@Controller()
export class CalculoController {
  constructor(
    @Inject(CALCULATION_SERVICE)
    private readonly calculationCliente: ClientProxy,
  ) {}

  @Get('getCalculation')
  async getAll() {
    const breaker = createBreaker(() =>
      this.calculationCliente.send('get_calculo', {}).toPromise(),
    );
    return breaker.fire();
  }

  @Get('getfiltrosCalculation')
  async filter(@Query() filters: FilterCalculoDto) {
    const breaker = createBreaker(() =>
      this.calculationCliente.send('filter_calculos', filters).toPromise(),
    );
    return breaker.fire();
  }

  @Get('getLocations')
  async getLocations() {
    const breaker = createBreaker(() =>
      this.calculationCliente.send('get_locations', {}).toPromise(),
    );
    return breaker.fire();
  }

  @Get('getfiltrosQ')
  async getQByRange(@Query() filters: FilterCalculoDto) {
    const breaker = createBreaker(() =>
      this.calculationCliente.send('get_q_range', filters).toPromise(),
    );
    return breaker.fire();
  }

  @Get('getfiltrosP')
  async getPByRange(@Query() filters: FilterCalculoDto) {
    const breaker = createBreaker(() =>
      this.calculationCliente.send('get_p_range', filters).toPromise(),
    );
    return breaker.fire();
  }

  @Get('getfiltrosK')
  async getKByRange(@Query() filters: FilterCalculoDto) {
    const breaker = createBreaker(() =>
      this.calculationCliente.send('get_k_range', filters).toPromise(),
    );
    return breaker.fire();
  }

  @Post('postCalculation')
  async create(@Body() data: CreateCalculoDto) {
    const breaker = createBreaker(() =>
      this.calculationCliente.send('create_calculo', data).toPromise(),
    );
    return breaker.fire();
  }

  @Put('updateCalculation')
  async update(@Body() data: UpdateCalculoDto) {
    const breaker = createBreaker(() =>
      this.calculationCliente.send('update_calculo', data).toPromise(),
    );
    return breaker.fire();
  }

  @Delete('deleteCalculation/:id')
  async delete(@Param('id') id: string) {
    const breaker = createBreaker(() =>
      this.calculationCliente.send('delete_calculo', { _id: id }).toPromise(),
    );
    return breaker.fire();
  }
}
