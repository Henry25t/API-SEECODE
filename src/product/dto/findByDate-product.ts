import {  IsArray, IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class FindProductByDateDto {

    @IsNotEmpty()
    @IsDateString()
    initialDate: string;
    
    @IsNotEmpty()
    @IsDateString()
    endDate: string;
}