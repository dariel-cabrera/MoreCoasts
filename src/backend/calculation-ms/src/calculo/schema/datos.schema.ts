import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema({ versionKey: false })
export class Calculation {
  @Prop({ type: Number, required: true })
  densidad_a: number;

  @Prop({ type: Number, required: true })
  densidad_m: number;

  @Prop({ type: Number, required: true })
  indice: number;

  @Prop({ type: Number, required: true })
  coeficiente: number;

  @Prop({ type: Number, required: true })
  altura: number;

  @Prop({ type: Number, required: true })
  angulo: number;

  @Prop({ type: Number, required: true })
  aceleracion: number;

  @Prop({ type: Number, required: true })
  Q: number;

  @Prop({ type: Number, required: true })
  P: number;

  @Prop({ type: Number, required: true })
  K: number;
  
  @Prop({ type: String, required: true })
  ubicacion: string;

  @Prop({ type: Date, default: Date.now })
  fecha:Date;

  

}

// ✅ Se exporta con un nombre coherente
export const CalculationSchema = SchemaFactory.createForClass(Calculation);
 