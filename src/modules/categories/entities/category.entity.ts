import { Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'categories' })
export class Category {
  @PrimaryColumn({ unique: true })
  name: string;
}
