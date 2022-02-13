import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ResponseExpenseDto } from './dto/response-expense.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.updateOne(+id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(+id);
  }
}
