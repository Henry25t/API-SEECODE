import {  IsArray, IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateSaleDto {

    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsNotEmpty()
    @IsNumber()
    total: number;

    @IsNotEmpty()
    @IsNumber()
    clientId: number;

    @IsNotEmpty()
    @IsArray()
    products: Products[]
}

 interface Products {
    productId:   number;
    cantidad: number;
}

