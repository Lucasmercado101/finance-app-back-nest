import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class GetTotalExpensesDto {
  @Type(() => Date)
  @IsDate()
  readonly from!: Date;

  @Type(() => Date)
  @IsDate()
  readonly to!: Date;
}
