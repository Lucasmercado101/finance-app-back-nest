import { Category } from 'src/modules/categories/entities/category.entity';
import { Currency } from 'src/modules/currencies/entities/currency.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'incomes' })
export class Income {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column()
  amount!: number;

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => Currency)
  currency!: Currency;

  @ManyToOne(() => Category, { nullable: true })
  category?: Category;
}
