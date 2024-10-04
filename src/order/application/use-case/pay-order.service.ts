import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Order } from 'src/order/domain/entity/order.entity';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistence/product.repository.interface'; // Interface du repo produit
import { OrderItem } from 'src/order/domain/entity/order-item.entity';

export class PayOrderService {
  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly productRepository: ProductRepositoryInterface, // Ajout du repo produit
  ) {}

  public async execute(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Pas de commande');
    }

    // Vérifier que les produits de la commande ont suffisamment de stock
    for (const orderItem of order.orderItems) {
      const product = await this.productRepository.findById(orderItem.product.id);

      if (!product) {
        throw new NotFoundException(`Produit avec l'ID ${orderItem.product.id} non trouvé`);
      }

      if (product.stock < orderItem.quantity) {
        throw new BadRequestException(
          `Stock insuffisant pour le produit "${product.name}". Disponible: ${product.stock}, requis: ${orderItem.quantity}`,
        );
      }
    }

    // Tout est bon, on peut maintenant décrémenter le stock des produits
    for (const orderItem of order.orderItems) {
      const product = await this.productRepository.findById(orderItem.product.id);

      product.stock -= orderItem.quantity; // Mise à jour du stock
      await this.productRepository.save(product); // Sauvegarde de la mise à jour
    }

    // Ensuite on procède au paiement
    order.pay();

    return this.orderRepository.save(order);
  }
}
