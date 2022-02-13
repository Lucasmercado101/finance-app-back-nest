import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateIncomeDto {
  @Type(() => Date)
  @IsOptional()
  readonly created_at: Date = new Date();

  @IsNumber()
  readonly amount!: number;

  @IsString()
  @IsOptional()
  readonly category?: string;

  @IsString()
  @IsOptional()
  readonly comment?: string;

  @IsString()
  readonly currency: string;
}
