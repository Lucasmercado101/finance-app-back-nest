import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { BetweenDatesDto } from './dto/between-dates.dto';
import { ResponseExpenseDto } from './dto/response-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { Currency } from '../currencies/entities/currency.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    private readonly currencyService: CurrenciesService,
    private readonly categoryService: CategoriesService,
  ) {}

  public async create(
    createExpenseDto: CreateExpenseDto,
  ): Promise<ResponseExpenseDto> {
    const expense = this.expenseRepository.create({
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

    if (createExpenseDto.category) {
      if (
        !(await this.categoryService.categoryExists(createExpenseDto.category))
      ) {
        throw new BadRequestException(
          `Category ${createExpenseDto.category} does not exist`,
        );
      }
    }

    const currency = await this.currencyService.findOne(
      createExpenseDto.currency,
    );

    const category = await this.categoryService.findOne(
      createExpenseDto.category,
    );

    expense.currency = currency;
    expense.category = category;
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
    return this.expenseRepository
      .findOne(id, { relations: ['currency'] })
      .then((expense) => {
        if (!expense) {
          throw new NotFoundException(`Expense with id ${id} not found`);
        }
        return this.toResponseDTO(expense);
      });
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

  public async getTotal(
    between: BetweenDatesDto,
  ): Promise<{ amount: number; currency: string }[]> {
    return this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'amount')
      .addSelect('expense.currency', 'currency')
      .where('expense.created_at BETWEEN :from AND :to', {
        from: between.from.toISOString(),
        to: between.to.toISOString(),
      })
      .groupBy('expense.currency')
      .getRawMany();
  }

  public async getBetween(
    between: BetweenDatesDto,
  ): Promise<ResponseExpenseDto[]> {
    return this.expenseRepository
      .createQueryBuilder('expense')
      .where('expense.created_at BETWEEN :from AND :to', {
        from: between.from.toISOString(),
        to: between.to.toISOString(),
      })
      .leftJoinAndSelect('expense.currency', 'currency')
      .where('currency.name = expense.currency')
      .getMany()
      .then((expenses) => expenses.map(this.toResponseDTO));
  }

  private toResponseDTO(expense: Expense): ResponseExpenseDto {
    const currencyName = expense.currency.name;
    const CategoryName = expense.category ? expense.category.name : null;
    const currencyResponse: ResponseExpenseDto = {
      ...expense,
      currency: currencyName,
      category: CategoryName,
    };
    return currencyResponse;
  }
}
