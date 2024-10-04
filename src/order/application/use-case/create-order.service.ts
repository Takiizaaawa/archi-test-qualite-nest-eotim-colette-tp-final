import { CreateOrderCommand, Order } from '../../domain/entity/order.entity';
import { OrderRepositoryInterface } from '../../domain/port/persistance/order.repository.interface';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistence/product.repository.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderItem } from 'src/order/domain/entity/order-item.entity';

export class CreateOrderService {
  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly productRepository: ProductRepositoryInterface, // Ajout du repo produit
  ) {}

  async execute(createOrderCommand: CreateOrderCommand): Promise<Order> {
    // Vérification des produits associés aux articles de la commande
    for (const item of createOrderCommand.items) {
      const product = await this.productRepository.findById(item.productId);

      if (!product) {
        throw new NotFoundException(`Produit avec l'ID ${item.productId} non trouvé`);
      }

      if (!product.isActive) {
        throw new BadRequestException(`Le produit "${product.name}" est inactif`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuffisant pour le produit "${product.name}". Disponible: ${product.stock}, requis: ${item.quantity}`,
        );
      }
    }

    // Création de la commande après vérification des produits
    const order = new Order(createOrderCommand);

    // Mise à jour du stock des produits
    for (const item of order.orderItems) {
      const product = await this.productRepository.findById(item.product.id);
      product.stock -= item.quantity;
      await this.productRepository.save(product); // Sauvegarde du nouveau stock
    }

    // Sauvegarde de la commande
    return await this.orderRepository.save(order);
  }
}
