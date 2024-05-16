import { IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class SearProductDto {
    @IsOptional()
    @IsString()
    name: string = '';

    @IsOptional()
    @IsString()
    code: string = '';

    /*@IsOptional()
    @IsNumber()
    stock: number*/

    /*@IsOptional()
    @IsNumber()
    price: number*/
    
    @IsInt()
    @Min(1)
    page: 
  
    @IsInt()
    @Min(1)
    limit:
}

