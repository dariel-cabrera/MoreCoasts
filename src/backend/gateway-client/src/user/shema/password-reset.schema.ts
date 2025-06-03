import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PasswordResetDocument = PasswordReset & Document; // ✅ Define el tipo correctamente

@Schema({ timestamps: true }) // Esto maneja automáticamente `created_at`
export class PasswordReset {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  token: string;
}

export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);

