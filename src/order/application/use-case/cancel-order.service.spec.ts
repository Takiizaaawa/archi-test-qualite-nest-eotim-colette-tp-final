import { CancelOrderService } from '../use-case/cancel-order.service';
import { OrderRepositoryInterface } from '../../domain/port/persistance/order.repository.interface';
import { Order } from '../../domain/entity/order.entity';
import { NotFoundException } from '@nestjs/common';

class OrderRepositoryFake implements OrderRepositoryInterface {
  private orders: Record<string, Order> = {};

  async findById(id: string): Promise<Order | null> {
    return this.orders[id] || null;
  }

  async save(order: Order): Promise<Order> {
    this.orders[order.id] = order;
    return order;
  }
}

const orderRepositoryFake = new OrderRepositoryFake();

describe('CancelOrderService', () => {
  it('should throw NotFoundException if the order does not exist', async () => {
    const cancelOrderService = new CancelOrderService(orderRepositoryFake);

    await expect(
      cancelOrderService.execute('non-existent-order-id', 'Customer changed mind'),
    ).rejects.toThrow(new NotFoundException('Pas de commande'));
  });

  it('should cancel the order successfully', async () => {
    const cancelOrderService = new CancelOrderService(orderRepositoryFake);

    const order = new Order({
      customerName: 'John Doe',
      items: [{ productName: 'item 1', price: 100, quantity: 1 }],
      shippingAddress: 'Shipping Address',
      invoiceAddress: 'Invoice Address',
    });

    await orderRepositoryFake.save(order);

    const result = await cancelOrderService.execute(order.id, 'Customer changed mind');

    expect(result).toBe(order);
    expect(result['status']).toBe('CANCELED'); // Ensure the order is canceled
    expect(result['cancelAt']).toBeDefined(); // Ensure the order has a cancelAt timestamp
    expect(result['cancelReason']).toBe('Customer changed mind'); // Check the cancel reason
  });

  it('should throw an error if the order is already shipped or delivered', async () => {
    const cancelOrderService = new CancelOrderService(orderRepositoryFake);

    const order = new Order({
      customerName: 'John Doe',
      items: [{ productName: 'item 1', price: 100, quantity: 1 }],
      shippingAddress: 'Shipping Address',
      invoiceAddress: 'Invoice Address',
    });

    order['status'] = 'SHIPPED';
    await orderRepositoryFake.save(order);

    await expect(
      cancelOrderService.execute(order.id, 'Customer changed mind'),
    ).rejects.toThrow(new Error('Vous ne pouvez pas annuler cette commande'));
  });
});
