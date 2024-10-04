import { NotFoundException } from '@nestjs/common';
import { Order } from 'src/order/domain/entity/order.entity';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistence/product.repository.interface';

export class CancelOrderService {
  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly productRepository: ProductRepositoryInterface, // Ajout du repo produit
  ) {}

  public async execute(orderId: string, cancelReason: string): Promise<Order> {
    // Récupérer la commande par ID
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Pas de commande');
    }

    // Remise en stock des produits associés à la commande
    for (const orderItem of order.orderItems) {
      const product = await this.productRepository.findById(orderItem.product.id);

      if (!product) {
        throw new NotFoundException(
          `Produit avec l'ID ${orderItem.product.id} non trouvé pour la commande`,
        );
      }

      // Réajuster le stock du produit
      product.stock += orderItem.quantity;
      await this.productRepository.save(product); // Sauvegarde du stock mis à jour
    }

    // Annuler la commande
    order.cancel(cancelReason);

    // Sauvegarder la commande annulée
    return this.orderRepository.save(order);
  }
}
