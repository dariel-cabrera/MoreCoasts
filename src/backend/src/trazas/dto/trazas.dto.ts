import { IsString,IsNotEmpty,IsDate} from "class-validator"

export class TrazasCreateDto{
    @IsNotEmpty()
    @IsString()
    user_name:string

    @IsNotEmpty()
    @IsString()
    accion:string

    @IsNotEmpty()
    @IsDate()
    fecha:Date
}