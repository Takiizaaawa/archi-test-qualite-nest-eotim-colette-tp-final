import { PayOrderService } from '../use-case/pay-order.service';
import { OrderRepositoryInterface } from '../../domain/port/persistance/order.repository.interface';
import { Order } from '../../domain/entity/order.entity';
import { NotFoundException } from '@nestjs/common';

// Fake OrderRepository implementation
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

describe('PayOrderService', () => {
  it('should throw NotFoundException if the order does not exist', async () => {
    const payOrderService = new PayOrderService(orderRepositoryFake);

    // Execute the test
    await expect(payOrderService.execute('non-existent-order-id')).rejects.toThrow(
      new NotFoundException('Pas de commande'),
    );
  });

  it('should pay the order successfully', async () => {
    const payOrderService = new PayOrderService(orderRepositoryFake);

    // Creating a fake order
    const order = new Order({
      customerName: 'John Doe',
      items: [{ productName: 'item 1', price: 100, quantity: 1 }],
      shippingAddress: 'Shipping Address',
      invoiceAddress: 'Invoice Address',
    });

    // Simulate saving the order to the repository
    await orderRepositoryFake.save(order);

    // Execute the test
    const result = await payOrderService.execute(order.id);

    // Assertions
    expect(result).toBe(order);
    expect(result['status']).toBe('PAID'); // Ensure the order is paid
    expect(result['paidAt']).toBeDefined(); // Ensure the order has a paidAt timestamp
  });

  it('should throw an error if the order is already paid', async () => {
    const payOrderService = new PayOrderService(orderRepositoryFake);

    // Creating a fake order
    const order = new Order({
      customerName: 'John Doe',
      items: [{ productName: 'item 1', price: 100, quantity: 1 }],
      shippingAddress: 'Shipping Address',
      invoiceAddress: 'Invoice Address',
    });

    // Simulate saving the order and marking it as paid
    order['status'] = 'PAID';
    await orderRepositoryFake.save(order);

    // Execute the test
    await expect(payOrderService.execute(order.id)).rejects.toThrow(
      new Error('Commande déjà payée'),
    );
  });
});
