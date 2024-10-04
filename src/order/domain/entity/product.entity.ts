
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BadRequestException } from '@nestjs/common';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(name: string, price: number, stock: number, description?: string) {
    this.setName(name);
    this.setPrice(price);
    this.setStock(stock);
    this.description = description || '';
    this.isActive = true;
  }

  /**
   * Définit le nom du produit, ne peut pas être vide.
   * @param name Nom du produit.
   */
  setName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new BadRequestException('Le nom du produit est requis');
    }
    this.name = name;
  }

  /**
   * Définit le prix du produit, doit être supérieur à zéro.
   * @param price Prix du produit.
   */
  setPrice(price: number): void {
    if (price <= 0) {
      throw new BadRequestException('Le prix doit être supérieur à zéro');
    }
    this.price = price;
  }

  /**
   * Définit le stock du produit, doit être supérieur ou égal à zéro.
   * @param stock Quantité en stock.
   */
  setStock(stock: number): void {
    if (stock < 0) {
      throw new BadRequestException('Le stock ne peut pas être négatif');
    }
    this.stock = stock;
  }

  /**
   * Augmente le stock du produit.
   * @param quantity Quantité à ajouter.
   */
  increaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new BadRequestException('La quantité à ajouter doit être positive');
    }
    this.stock += quantity;
  }

  /**
   * Diminue le stock du produit.
   * @param quantity Quantité à retirer.
   */
  decreaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new BadRequestException('La quantité à retirer doit être positive');
    }
    if (quantity > this.stock) {
      throw new BadRequestException('Stock insuffisant');
    }
    this.stock -= quantity;
  }

  /**
   * Active le produit.
   */
  activate(): void {
    if (this.isActive) {
      throw new BadRequestException('Le produit est déjà actif');
    }
    this.isActive = true;
  }

  /**
   * Désactive le produit.
   */
  deactivate(): void {
    if (!this.isActive) {
      throw new BadRequestException('Le produit est déjà désactivé');
    }
    this.isActive = false;
  }

  /**
   * Retourne les détails du produit sous forme de texte.
   */
  getProductDetails(): string {
    return `Product: ${this.name}, Price: ${this.price}€, Stock: ${this.stock}, Description: ${this.description || 'N/A'}`;
  }
}
