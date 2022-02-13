import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Currency } from './entities/currency.entity';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  create(createCurrencyDto: CreateCurrencyDto) {
    return this.currencyRepository.save(createCurrencyDto);
  }

  findAll() {
    return this.currencyRepository.find();
  }

  findOne(name: string) {
    return this.currencyRepository.findOne({ where: { name } });
  }

  update(name: string, updateCurrencyDto: UpdateCurrencyDto) {
    return this.currencyRepository.update(name, updateCurrencyDto);
  }

  remove(name: string) {
    return this.currencyRepository.delete(name);
  }

  public async currencyExists(currency: string): Promise<boolean> {
    const result = await this.currencyRepository.findOne({
      where: {
        name: currency,
      },
    });
    return !!result;
  }
}
