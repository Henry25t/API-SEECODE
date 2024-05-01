import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class SearchClientDto {
    @IsOptional()
    @IsString()
    name: string = '';

    @IsOptional()
    @IsString()
    dui: string = '';
    
    @IsInt()
    @Min(1)
    page: number = 1;
  
    @IsInt()
    @Min(1)
    limit: number = 10;
}

