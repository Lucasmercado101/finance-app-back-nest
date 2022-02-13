import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrenciesService } from '../currencies/currencies.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ResponseExpenseDto } from './dto/response-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    private readonly currencyService: CurrenciesService,
  ) {}

  public async create(
    createExpenseDto: CreateExpenseDto,
  ): Promise<ResponseExpenseDto> {
    const expense = this.expenseRepository.create({
      category: createExpenseDto.category,
      comment: createExpenseDto.comment,
      created_at: createExpenseDto.created_at,
      amount: createExpenseDto.amount,
    });

    if (
      !(await this.currencyService.currencyExists(createExpenseDto.currency))
    ) {
      throw new BadRequestException(
        `Currency ${createExpenseDto.currency} does not exist`,
      );
    }
    const currency = await this.currencyService.findOne(
      createExpenseDto.currency,
    );
    expense.currency = currency;
    return this.expenseRepository.save(expense).then(this.toResponseDTO);
  }

  public async findAll(): Promise<ResponseExpenseDto[]> {
    return await this.expenseRepository
      .find({
        relations: ['currency'],
      })
      .then((expenses) => expenses.map(this.toResponseDTO));
  }

  findOne(id: number) {
    return this.expenseRepository.findOne(id, { relations: ['currency'] });
  }

  public async updateOne(id: number, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.expenseRepository.findOne(id);
    if (!expense) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }
    for (const key in updateExpenseDto) {
      if (updateExpenseDto.hasOwnProperty(key)) {
        expense[key] = updateExpenseDto[key];
      }
    }
    return this.expenseRepository.update(id, expense);
  }

  remove(id: number) {
    return this.expenseRepository.delete(id);
  }

  private toResponseDTO(expense: Expense): ResponseExpenseDto {
    const currencyName = expense.currency.name;
    delete expense.currency;
    const currencyResponse: ResponseExpenseDto = {
      ...expense,
      currency: currencyName,
    };
    return currencyResponse;
  }
}
