import { IsOptional, IsString, IsDateString } from 'class-validator';

export class FilterCalculoDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
