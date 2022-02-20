import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { BetweenDatesDto } from '../expenses/dto/between-dates.dto';
import { CreateIncomeDto } from './dto/create-income.dto';
import { ResponseIncomeDto } from './dto/response-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Income } from './entities/income.entity';

@Injectable()
export class IncomesService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
    private readonly currencyService: CurrenciesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  public async create(
    createIncomeDto: CreateIncomeDto,
  ): Promise<ResponseIncomeDto> {
    const income = this.incomeRepository.create({
      comment: createIncomeDto.comment,
      created_at: createIncomeDto.created_at,
      amount: createIncomeDto.amount,
    });

    if (
      !(await this.currencyService.currencyExists(createIncomeDto.currency))
    ) {
      throw new BadRequestException(
        `Currency ${createIncomeDto.currency} does not exist`,
      );
    }

    if (createIncomeDto.category) {
      if (
        !(await this.categoriesService.categoryExists(createIncomeDto.category))
      ) {
        throw new BadRequestException(
          `Category ${createIncomeDto.category} does not exist`,
        );
      }
    }

    const currency = await this.currencyService.findOne(
      createIncomeDto.currency,
    );

    const category = await this.categoriesService.findOne(
      createIncomeDto.category,
    );

    income.currency = currency;
    income.category = category;
    return this.incomeRepository.save(income).then(this.toResponseDTO);
  }

  public async findAll(): Promise<ResponseIncomeDto[]> {
    return await this.incomeRepository
      .find({
        relations: ['currency'],
      })
      .then((expenses) => expenses.map(this.toResponseDTO));
  }

  public async findOne(id: number): Promise<ResponseIncomeDto> {
    const income = await this.incomeRepository.findOne(id);
    if (!income) {
      throw new BadRequestException(`Income with id ${id} does not exist`);
    }
    return this.toResponseDTO(income);
  }

  public async updateOne(id: number, updateExpenseDto: UpdateIncomeDto) {
    const expense = await this.incomeRepository.findOne(id);
    if (!expense) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }
    for (const key in updateExpenseDto) {
      if (updateExpenseDto.hasOwnProperty(key)) {
        expense[key] = updateExpenseDto[key];
      }
    }
    return this.incomeRepository.update(id, expense);
  }

  remove(id: number) {
    return this.incomeRepository.delete(id);
  }

  public async getBetween(
    between: BetweenDatesDto,
  ): Promise<ResponseIncomeDto[]> {
    return this.incomeRepository
      .createQueryBuilder('income')
      .where('income.created_at BETWEEN :from AND :to', {
        from: between.from.toISOString(),
        to: between.to.toISOString(),
      })
      .leftJoinAndSelect('income.currency', 'currency')
      .where('currency.name = income.currency')
      .getMany()
      .then((incomes) => incomes.map(this.toResponseDTO));
  }

  private toResponseDTO(expense: Income): ResponseIncomeDto {
    const currencyName = expense.currency.name;
    const categoryName = expense.category ? expense.category.name : null;
    const currencyResponse: ResponseIncomeDto = {
      ...expense,
      currency: currencyName,
      category: categoryName,
    };
    return currencyResponse;
  }
}
