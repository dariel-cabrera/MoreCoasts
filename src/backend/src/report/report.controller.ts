// controllers/reporte.controller.ts
import { Response } from 'express';
import { IReporteGenerador,ReporteConfig } from './interface/report.interface';
import { Controller,Get, Res, Inject, Query } from '@nestjs/common';

@Controller('reportes')
export class ReporteController {

  
  constructor(
    @Inject('IReporteGenerador') 
    private reporteGenerador: IReporteGenerador<any>
    ) {}

    @Get('export-excel')   
  async exportToExcel(res: Response, data: any[], config: ReporteConfig): Promise<void> {
    try {
      const buffer = await this.reporteGenerador.generar( data, config);

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', `attachment; filename=${config.nombreHoja || 'reporte'}.xlsx`);
      res.send(buffer);
    } catch (error) {
      console.error('Error al exportar:', error);
      res.status(500).json({ error: 'Error al generar el reporte' });
        }
    }
}
