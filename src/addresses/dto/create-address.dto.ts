import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { } from 'validator'

export class CreateAddressDto {
    @IsNotEmpty()
    @IsString()
    department: string

    @IsNotEmpty()
    @IsString()
    municipality: string

    @IsNotEmpty()
    @IsString()
    complement: string
}
