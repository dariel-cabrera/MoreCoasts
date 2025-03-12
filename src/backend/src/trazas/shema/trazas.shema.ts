import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date } from 'mongoose';


@Schema({ versionKey: false })
export class Trazas {
    @Prop({ required: true })
    user_name: string;

    @Prop({ required: true })
    accion: string;

    @Prop({ required: true, type: Date })
    fecha: Date;
}

// ✅ Se exporta con un nombre coherente
export const TrazasSchema = SchemaFactory.createForClass(Trazas);