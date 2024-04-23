import { IsNotEmpty, IsString } from "class-validator";

export class CreateClientDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    dui: string;

    @IsNotEmpty()
    @IsString()
    points: number;
}
