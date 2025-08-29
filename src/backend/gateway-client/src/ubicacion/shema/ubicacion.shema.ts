import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';


@Schema({ versionKey: false })
export class Ubicacion {
    @Prop({ required: true })
    nombre: string;

    @Prop({ required: true })
    ciudad: string;

    @Prop({ type: [Array], required: true })
    poligono: [number, number][]; // Array de coordenadas [lat, lng]

}

export const UbicacionSchema = SchemaFactory.createForClass(Ubicacion);