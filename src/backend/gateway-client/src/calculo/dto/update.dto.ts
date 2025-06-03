import { IsNotEmpty, IsNumber, IsString} from "class-validator"

export class UpdateCalculoDto{
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
    P:number   
}