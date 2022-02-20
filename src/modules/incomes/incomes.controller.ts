import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { ResponseIncomeDto } from './dto/response-income.dto';
import { BetweenDatesDto } from '../expenses/dto/between-dates.dto';

@Controller('income')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Post()
  create(@Body() createIncomeDto: CreateIncomeDto): Promise<ResponseIncomeDto> {
    return this.incomesService.create(createIncomeDto);
  }

  @Get()
  findAll() {
    return this.incomesService.findAll();
  }

  @Get('between')
  public async getBetween(
    @Query() queryParams: BetweenDatesDto,
  ): Promise<ResponseIncomeDto[]> {
    return this.incomesService.getBetween(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incomesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIncomeDto: UpdateIncomeDto) {
    return this.incomesService.updateOne(+id, updateIncomeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incomesService.remove(+id);
  }
}
