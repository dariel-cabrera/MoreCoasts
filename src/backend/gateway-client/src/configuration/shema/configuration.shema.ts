import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema({ versionKey: false })
export class Configuration {
  @Prop({ type: Number, required: true })
  densidad_aMax: number;

  @Prop({ type: Number, required: true })
  densidad_aMin: number;

  @Prop({ type: Number, required: true })
  densidad_mMax: number;

  @Prop({ type: Number, required: true })
  densidad_mMin: number;

  @Prop({ type: Number, required: true })
  indiceMax: number;

  @Prop({ type: Number, required: true })
  indiceMin: number;

  @Prop({ type: Number, required: true })
  coeficienteMax: number;

  @Prop({ type: Number, required: true })
  coeficienteMin: number;

  @Prop({ type: Number, required: true })
  alturaMax: number;

  @Prop({ type: Number, required: true })
  alturaMin: number;

  @Prop({ type: Number, required: true })
  anguloMax: number;

  @Prop({ type: Number, required: true })
  anguloMin: number;

  @Prop({ type: Number, required: true })
  aceleracionMax: number;

  @Prop({ type: Number, required: true })
  aceleracionMin: number;

  @Prop({ type: Number, required: true })
  PMax: number;

  @Prop({ type: Number, required: true })
  PMin: number;

  
 

}

// ✅ Se exporta con un nombre coherente
export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
 