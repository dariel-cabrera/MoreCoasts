import { Type } from "class-transformer";
import { 
    ArrayMinSize, 
    IsArray, 
    IsNotEmpty, 
    IsNumber, 
    IsString, 
    Max, 
    Min, 
    ValidateNested,
    IsLongitude,
    IsLatitude 
} from "class-validator";

export class UbicacionDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    nombre: string;

    @IsString()
    @IsNotEmpty({ message: 'La ciudad no puede estar vacía' })
    ciudad: string;

    @IsArray()
    @ArrayMinSize(1)
    poligono: [number, number][];
}

