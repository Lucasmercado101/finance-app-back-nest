import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'currencies' })
export class Currency {
  @PrimaryColumn({ unique: true })
  name: string;
}
