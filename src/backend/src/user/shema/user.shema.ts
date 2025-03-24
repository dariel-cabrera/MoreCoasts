import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true })  // ✅ Agrega createdAt y updatedAt automáticamente
export class User {
  @Prop({ required: true })
  user_name: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  ci:string;

  @Prop()
  profile_image: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// ✅ Agregar virtual para `id`
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// ✅ Asegurar que el `toJSON` incluya virtuals como en Express
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });
