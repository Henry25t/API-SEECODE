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
