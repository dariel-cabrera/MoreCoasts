import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class UbicacionDto{

        @IsString()
        @IsNotEmpty()
        nombre:string

        @IsString()
        @IsNotEmpty()
        ciudad: string
        
        @IsNumber()
        @IsNotEmpty()
        poligono: number[][]
        
       

}