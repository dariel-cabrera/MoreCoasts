// src/reportes/reportes.module.ts
import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReporteController } from './report.controller';


@Module({
  controllers: [ReporteController],
  providers: [
    {
      provide: 'IReporteGenerador', // Token para la interfaz
      useClass: ReportService, // Implementación concreta
    },
  ],
  exports: ['IReporteGenerador'], // Exportar para usar en otros módulos
})
export class ReportesModule {}