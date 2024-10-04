import { Order } from './order.entity';
import { Product } from './product.entity'; // Importation de Product
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export interface ItemDetailCommand {
  productId: string; // Utilisation de l'ID du produit
  quantity: number;
}

@Entity('order-item')
export class OrderItem {
  static MAX_QUANTITY = 5;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, { eager: true }) // Relation avec Product
  product: Product;

  @Column({
    type: 'int',
  })
  quantity: number;

  @Column({
    type: 'int',
  })
  price: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  constructor(itemCommand: ItemDetailCommand, product: Product) {
    if (!itemCommand || !product) {
      return;
    }

    if (itemCommand.quantity > OrderItem.MAX_QUANTITY) {
      throw new Error(
        `La quantité d'articles ne peut pas dépasser ${OrderItem.MAX_QUANTITY}`,
      );
    }

    if (itemCommand.quantity > product.stock) {
      throw new Error(
        `Quantité de produit "${product.name}" non disponible en stock`,
      );
    }

    this.product = product;
    this.quantity = itemCommand.quantity;
    this.price = product.price * this.quantity; // Le prix est basé sur le produit
  }
}
