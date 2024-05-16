import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class SearchUserDto {
    @IsOptional()
    @IsString()
    name: boolean = '';

    @IsOptional()
    @IsString()
    lastName: string = '';
    
    @IsInt()
    @Min(1)
    page: number = 1;
  
    @IsInt()
    @Min(1)
    limit: string = 100;
}

