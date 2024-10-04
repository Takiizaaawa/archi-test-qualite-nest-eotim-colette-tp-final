
import { Test, TestingModule } from '@nestjs/testing';
import { AddToCartService } from './add-to-cart.service';
import { OrderRepositoryInterface } from '../domain/port/persistence/order.repository.interface';
import { ProductRepositoryInterface } from '../domain/port/persistence/product.repository.interface';
import { Order } from '../domain/entity/order.entity';
import { Product } from '../domain/entity/product.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AddToCartService', () => {
  let service: AddToCartService;
  let orderRepository: OrderRepositoryInterface;
  let productRepository: ProductRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddToCartService,
        {
          provide: OrderRepositoryInterface,
          useValue: {
            findById: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ProductRepositoryInterface,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AddToCartService>(AddToCartService);
    orderRepository = module.get<OrderRepositoryInterface>(OrderRepositoryInterface);
    productRepository = module.get<ProductRepositoryInterface>(ProductRepositoryInterface);
  });

  it('should add a product to an order in Pending status', async () => {
    const order = new Order({ status: 'PENDING', items: [] });
    const product = new Product({ id: '1', name: 'Product 1', price: 100, stock: 10 });

    jest.spyOn(orderRepository, 'findById').mockResolvedValue(order);
    jest.spyOn(productRepository, 'findById').mockResolvedValue(product);

    await service.execute({ orderId: '1', productId: '1', quantity: 2 });

    expect(order.items.length).toBe(1);
    expect(order.items[0].quantity).toBe(2);
    expect(order.price).toBe(200); // Recalculating total price
  });

  it('should throw NotFoundException if order or product is not found', async () => {
    jest.spyOn(orderRepository, 'findById').mockResolvedValue(null);

    await expect(service.execute({ orderId: '1', productId: '1', quantity: 2 }))
      .rejects
      .toThrow(NotFoundException);
  });

  it('should throw BadRequestException if order is not in Pending status', async () => {
    const order = new Order({ status: 'PAID', items: [] });
    jest.spyOn(orderRepository, 'findById').mockResolvedValue(order);

    await expect(service.execute({ orderId: '1', productId: '1', quantity: 2 }))
      .rejects
      .toThrow(BadRequestException);
  });
});
