import { IsNotEmpty,IsNumber,IsString,} from 'class-validator'


export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsNumber()
    rolId: number;
}
