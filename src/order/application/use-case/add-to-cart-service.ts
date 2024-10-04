import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepositoryInterface } from '../../domain/port/persistance/order.repository.interface';
import { Order } from '../../domain/entity/order.entity';
import { ItemDetailCommand } from '../entity/order-item.entity';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistence/product.repository.interface';
import { EmailServiceInterface } from 'src/notification/domain/service/email.service.interface';

@Injectable()
export class AddItemToOrderService {
    constructor(
        private readonly orderRepository: OrderRepositoryInterface,
        private readonly productRepository: ProductRepositoryInterface,
        private readonly emailService: EmailServiceInterface,
    ) {}

    public async execute(orderId: string, item: ItemDetailCommand): Promise<Order> {
        const order = await this.orderRepository.findById(orderId);

        if (!order) {
            throw new NotFoundException('Commande non trouvée');
        }

        await order.addItemToOrder(item);

        return this.orderRepository.save(order);
    }
}
