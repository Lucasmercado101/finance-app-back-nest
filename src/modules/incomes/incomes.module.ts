import { Module } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomesController } from './incomes.controller';
import { CurrenciesModule } from '../currencies/currencies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    CurrenciesModule,
    TypeOrmModule.forFeature([Income]),
    CategoriesModule,
  ],
  controllers: [IncomesController],
  providers: [IncomesService],
})
export class IncomesModule {}
