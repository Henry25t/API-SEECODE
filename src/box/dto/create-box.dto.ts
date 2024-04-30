import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateBoxDto {
    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsNotEmpty()
    @IsNumber()
    start: number;

    @IsNotEmpty()
    @IsNumber()
    totalSales: number;
}
