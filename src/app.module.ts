import { Module } from '@nestjs/common';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomesModule } from './modules/incomes/incomes.module';
import { CurrenciesModule } from './modules/currencies/currencies.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ExpensesModule,
    IncomesModule,
    CurrenciesModule,
    CategoriesModule,
  ],
})
export class AppModule {}
