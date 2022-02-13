import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrenciesService } from '../currencies/currencies.service';
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
  ) {}

  public async create(
    createIncomeDto: CreateIncomeDto,
  ): Promise<ResponseIncomeDto> {
    const income = this.incomeRepository.create({
      category: createIncomeDto.category,
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

    const currency = await this.currencyService.findOne(
      createIncomeDto.currency,
    );

    income.currency = currency;
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

  private toResponseDTO(expense: Income): ResponseIncomeDto {
    const currencyName = expense.currency.name;
    delete expense.currency;
    const currencyResponse: ResponseIncomeDto = {
      ...expense,
      currency: currencyName,
    };
    return currencyResponse;
  }
}
