import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ResponseExpenseDto } from './dto/response-expense.dto';
import { GetTotalExpensesDto } from './dto/get-total-expenses.dto';

@Controller('expense')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  public async create(
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<ResponseExpenseDto> {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  public async findAll(): Promise<ResponseExpenseDto[]> {
    return this.expensesService.findAll();
  }

  @Get('total')
  public async getTotal(
    @Body() getTotalExpensesDto: GetTotalExpensesDto,
  ): Promise<{ amount: number; currency: string }[]> {
    return this.expensesService.getTotal(getTotalExpensesDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.updateOne(id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.expensesService.remove(id);
  }
}
