import { Inject, Injectable } from '@nestjs/common';
import { IReporteGenerador } from 'src/report/interface/report.interface';

@Injectable()
export class ReporteExcelService {
  constructor(
    @Inject('IReporteGenerador')
    private readonly reporteGenerador: IReporteGenerador<any>,
  ) {}

  async generar(calculations: any[]) {
    const config = {
      nombreHoja: 'Cálculos de Sedimentos',
      columnas: [ { header: 'ID', key: '_id', width: 25 },
        { header: 'Densidad del Sedimento (ρs) [kg/m³]', key: 'densidad_a', width: 20 },
        { header: 'Densidad del Mar (ρ) [kg/m³]', key: 'densidad_m', width: 20 },
        { header: 'Índice de Rompiente (k)', key: 'indice', width: 15 },
        { header: 'Coeficiente de Porosidad (n)', key: 'coeficiente', width: 15 },
        { header: 'Altura (Hb) [m]', key: 'altura', width: 15 },
        { header: 'Ángulo (α) [°]', key: 'angulo', width: 15 },
        { header: 'Aceleración de la Gravedad (g) [m/s²]', key: 'aceleracion', width: 20 },
        { header: 'Q  [m³]', key: 'Q', width: 15 },
        { header: 'Medición Práctica (P) [m³]', key: 'P', width: 15 },
        { header: 'K ', key: 'K', width: 15 },],
      estiloEncabezado: {
        bold: true,
        fillColor: 'FFD3D3D3',
        alignment: {
          vertical: 'middle' as const,
          horizontal: 'center' as const,
        },
      },
    };

    const data = calculations.map(calc => ({
      ...calc.toObject(),
      _id: calc._id.toString(),
    }));

    const buffer = await this.reporteGenerador.generar(data, config);
    return { buffer, nombreHoja: config.nombreHoja };
  }
}
