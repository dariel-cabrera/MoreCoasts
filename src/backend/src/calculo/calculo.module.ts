import { Module } from "@nestjs/common";
import { CalculoController } from "./calculo.controller";
import { CalculoService } from "./calculo.service";
import { MongooseModule } from '@nestjs/mongoose';
import { Calculation,CalculationSchema } from "./shema/datos.schema";
import { TrazasModule } from 'src/trazas/trazas.module';
import { AuthModule } from "src/auth/auth.module";
import { ReportesModule } from "src/report/report.module";
import { ReporteExcelService } from "./reporte/ReporteExcel.service";
import { EcuacionesService } from "./ecuaciones/ecuaciones.service";
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Calculation.name, schema:  CalculationSchema }]),
    TrazasModule,
    AuthModule,
    ReportesModule
  ],
   controllers:[CalculoController],
   providers:[CalculoService,
    ReporteExcelService,
    EcuacionesService
   ],
   
})

export class CalculoModule{}