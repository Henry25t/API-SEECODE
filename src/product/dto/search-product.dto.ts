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
    page: number = 1;
  
    @IsInt()
    @Min(1)
    limit: number = 10;
}

