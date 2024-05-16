import {  IsArray, IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateSaleDto {

    date: number;

  
    total: number;

 
    clientId: number;

   
    products: Products[]

    boxId: number;
}

 interface Products {
    productId:   number;
    cantidad: number;
}

