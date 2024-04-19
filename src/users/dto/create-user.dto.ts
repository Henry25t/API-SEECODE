import { IsNotEmpty,IsNumber,IsString,} from 'class-validator'
import { Address } from 'src/addresses/entities/address.entity';


export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsNumber()
    rolId: number;
}

export interface SaveUsers extends CreateUserDto {
    department:   string;
    municipality: string;
    complement:   string;
}
