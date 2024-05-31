import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateClientDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    dui: string;

    @IsNotEmpty()
    @IsNumber()
    points: number;
}
