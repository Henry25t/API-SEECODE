import { IsNotEmpty,IsNumber,IsString,} from 'class-validator'


export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    email: number;

    @IsNotEmpty()
    @IsString()
    password: number;

    @IsNotEmpty()
    @IsNumber()
    rolId: number;
}

export interface SaveUsers extends CreateUserDto {
    department:   number;
    municipality: string;
    complement:   string;
}
