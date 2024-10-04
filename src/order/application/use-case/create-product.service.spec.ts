
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductService } from './create-product.service';
import { ProductRepositoryInterface } from '../domain/port/persistence/product.repository.interface';
import { Product } from '../domain/entity/product.entity';
import { BadRequestException } from '@nestjs/common';

describe('CreateProductService', () => {
  let service: CreateProductService;
  let productRepository: ProductRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductService,
        {
          provide: ProductRepositoryInterface,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateProductService>(CreateProductService);
    productRepository = module.get<ProductRepositoryInterface>(ProductRepositoryInterface);
  });

  it('should create a product successfully', async () => {
    const productData = { name: 'Product 1', price: 100, description: 'A test product', stock: 10 };
    const product = new Product(productData);

    jest.spyOn(productRepository, 'save').mockResolvedValue(product);

    const result = await service.execute(productData);
    expect(result).toEqual(product);
    expect(productRepository.save).toHaveBeenCalledWith(expect.objectContaining(productData));
  });

  it('should throw an error if name or price is missing', async () => {
    await expect(service.execute({ name: '', price: 100, description: 'desc' }))
      .rejects
