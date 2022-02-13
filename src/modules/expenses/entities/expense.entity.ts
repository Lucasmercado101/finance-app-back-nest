import { Currency } from 'src/modules/currencies/entities/currency.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'expenses' })
export class Expense {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column()
  amount!: number;

  @Column({ default: 'other' })
  category!: string;

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => Currency)
  currency!: Currency;
}
