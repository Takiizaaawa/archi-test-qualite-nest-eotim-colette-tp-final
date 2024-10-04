
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  code: string;

  @Column({ default: 1500 }) // Montant par défaut si non spécifié
  @Expose()
  amount: number;

  constructor(promotionCommand: Partial<Promotion>) {
    this.name = promotionCommand.name;
    this.code = promotionCommand.code;
    this.amount = promotionCommand.amount || 1500; // Valeur par défaut
  }
}
