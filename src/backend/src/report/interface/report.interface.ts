export interface IReporteGenerador<T> {
    generar(data: T[], config?: ReporteConfig): Promise<Buffer>;
  }
  
  export interface ReporteConfig {
    nombreHoja?: string;
    columnas: ColumnaConfig[];
    estiloEncabezado?: EstiloExcel;
  }
  
  export interface ColumnaConfig {
    header: string;
    key: string;
    width?: number;
  }
  
  export interface EstiloExcel {
    bold?: boolean;
    fillColor?: string;
    alignment?: { vertical: 'middle' | 'top'; horizontal: 'center' | 'left' };
  }