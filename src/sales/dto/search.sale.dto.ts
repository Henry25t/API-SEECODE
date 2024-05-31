import { IsDate, IsInt, IsOptional, IsString, Min } from "class-validator";

export class SearchSalesDto {
    // @IsOptional()
    // @IsString()
    // date: string = '';
    
    @IsInt()
    @Min(1)
    page: number = 1;
  
    @IsInt()
    @Min(1)
    limit: number = 10;
}

