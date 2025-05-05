import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { IReporteGenerador, ReporteConfig } from './interface/report.interface';

@Injectable()
export class ReportService<T> implements IReporteGenerador<T> {
  async generar( data: T[], config: ReporteConfig): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(config.nombreHoja || 'Datos');

    // Configurar columnas
    worksheet.columns = config.columnas;

    // Agregar datos
    data.forEach(item => worksheet.addRow(item));

    // Estilizar encabezados
    if (config.estiloEncabezado) {
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell(cell => {
        if (config.estiloEncabezado?.bold) cell.font = { bold: true };
        if (config.estiloEncabezado?.fillColor) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: config.estiloEncabezado.fillColor },
          };
        }
        if (config.estiloEncabezado?.alignment) {
          cell.alignment = config.estiloEncabezado.alignment;
        }
      });
    }

    // Generar buffer
    return Buffer.from(await workbook.xlsx.writeBuffer());
  }
}