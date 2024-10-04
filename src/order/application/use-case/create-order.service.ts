import { CreateOrderCommand, Order } from '../../domain/entity/order.entity';
import { OrderRepositoryInterface } from '../../domain/port/persistance/order.repository.interface';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistence/product.repository.interface';
import { EmailServiceInterface } from 'src/notification/domain/service/email.service.interface';

export class CreateOrderService {
  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly productRepository: ProductRepositoryInterface, // Ajout du repo produit
    private readonly emailService: EmailServiceInterface, // Ajout du service d'email
  ) {}

  async execute(createOrderCommand: CreateOrderCommand): Promise<Order> {
    // Création de la commande avec les dépendances nécessaires
    const order = new Order(createOrderCommand, this.productRepository, this.emailService);

    return await this.orderRepository.save(order);
  }
}
