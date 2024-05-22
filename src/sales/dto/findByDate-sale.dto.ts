import {  IsArray, IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class FindByDateDto {

    @IsNotEmpty()
    @IsDateString()
    initialDate: string;
    
    @IsNotEmpty()
    @IsDateString()
    endDate: string;
}