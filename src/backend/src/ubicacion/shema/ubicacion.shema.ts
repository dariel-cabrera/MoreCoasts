import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema({ versionKey: false })
export class Ubicacion {
    @Prop({ required: true })
    nombre: string;

    @Prop({ required: true })
    ciudad: string;

    @Prop({ required: true })
    poligono: number[][];
}

export const UbicacionSchema = SchemaFactory.createForClass(Ubicacion);