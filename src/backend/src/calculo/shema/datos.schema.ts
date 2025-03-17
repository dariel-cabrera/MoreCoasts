import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Datos extends Document {
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
}

export const DatosSchema = SchemaFactory.createForClass(Datos);