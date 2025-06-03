import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
  Patch,
  Inject,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CALCULATION_SERVICE } from 'src/config';
import { CreateCalculoDto } from './dto/create.dto';
import { UpdateCalculoDto } from './dto/update.dto';
import { FilterCalculoDto } from './dto/filter.dto';

@Controller()
export class CalculoController {
  constructor(
    @Inject(CALCULATION_SERVICE)
    private readonly calculationCliente: ClientProxy,
  ) {}

  @Get('getCalculation')
  getAll() {
    return this.calculationCliente.send('get_calculo', {});
  }

  @Get('getfiltrosCalculation')
  filter(@Query() filters: FilterCalculoDto) {
    return this.calculationCliente.send('filter_calculos', filters);
  }

  @Get('getLocations')
  getLocations() {
    return this.calculationCliente.send('get_locations', {});
  }

  @Get('getfiltrosQ')
  getQByRange(@Query() filters: FilterCalculoDto) {
    return this.calculationCliente.send('get_q_range', filters);
  }

  @Get('getfiltrosP')
  getPByRange(@Query() filters: FilterCalculoDto) {
    return this.calculationCliente.send('get_p_range', filters);
  }

  @Get('getfiltrosK')
  getKByRange(@Query() filters: FilterCalculoDto) {
    return this.calculationCliente.send('get_k_range', filters);
  }

  @Post('postCalculation')
  create(@Body() data: CreateCalculoDto) {
    return this.calculationCliente.send('create_calculo', data);
  }

  @Put('updateCalculation/:id')
  update(@Param('id') id: string, @Body() data: UpdateCalculoDto) {
    return this.calculationCliente.send('update_calculo', { id, ...data });
  }

  @Delete('deleteCalculation/:id')
  delete(@Param('id') id: string) {
    return this.calculationCliente.send('delete_calculo', { _id: id });
  }
}
