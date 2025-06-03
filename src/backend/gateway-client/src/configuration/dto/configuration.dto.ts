import { IsNumber,IsNotEmpty, IsString } from "class-validator"
export class ConfigurationDto{
        

        @IsNumber()
        @IsNotEmpty()
        densidad_aMax:number

        @IsNumber()
        @IsNotEmpty()
        densidad_aMin:number

        @IsNumber()
        @IsNotEmpty()
        densidad_mMax: number

        @IsNumber()
        @IsNotEmpty()
        densidad_mMin: number
        
        @IsNumber()
        @IsNotEmpty()
        indiceMax: number

        
        @IsNumber()
        @IsNotEmpty()
        indiceMin: number
        
        @IsNumber()
        @IsNotEmpty()
        coeficienteMax:number

        @IsNumber()
        @IsNotEmpty()
        coeficienteMin:number

        @IsNumber()
        @IsNotEmpty()
        alturaMax:number

        @IsNumber()
        @IsNotEmpty()
        alturaMin:number

        @IsNumber()
        @IsNotEmpty()
        anguloMax:number

        @IsNumber()
        @IsNotEmpty()
        anguloMin:number

        @IsNumber()
        @IsNotEmpty()
        aceleracionMax:number
 
        @IsNumber()
        @IsNotEmpty()
        aceleracionMin:number

        @IsNumber()
        @IsNotEmpty()
        PMax:number

        @IsNumber()
        @IsNotEmpty()
        PMin:number

        

}