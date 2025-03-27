import { IsNumber,IsNotEmpty, IsString } from "class-validator"
export class CreateCalculoDto{

        @IsNumber()
        @IsNotEmpty()
        densidad_a:number

        @IsNumber()
        @IsNotEmpty()
        densidad_m: number
        
        @IsNumber()
        @IsNotEmpty()
        indice: number
        
        @IsNumber()
        @IsNotEmpty()
        coeficiente:number

        @IsNumber()
        @IsNotEmpty()
        altura:number

        @IsNumber()
        @IsNotEmpty()
        angulo:number

        @IsNumber()
        @IsNotEmpty()
        aceleracion:number
        
        @IsNumber()
        @IsNotEmpty()
        Q:number

        @IsNumber()
        @IsNotEmpty()
        P:number

        @IsNumber()
        @IsNotEmpty()
        K:number

        @IsString()
        @IsNotEmpty()
        idUser:string
}