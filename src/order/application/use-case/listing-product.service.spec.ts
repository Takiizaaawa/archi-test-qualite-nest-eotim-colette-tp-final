import { Test, TestingModule } from '@nestjs/testing';
import { ListingProductService } from './listing-product.service';
import { ProductRepositoryInterface } from '../domain/port/persistence/product.repository.interface';

describe('ListingProductService', () => {
  let service: ListingProductService;
  let productRepository: ProductRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingProductService,
        {
          provide: ProductRepositoryInterface,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ListingProductService>(ListingProductService);
    productRepository = module.get<ProductRepositoryInterface>(ProductRepositoryInterface);
  });

  it('should list all active products', async () => {
    const products = [{ id: '1', name: 'Product 1', active: true }];
    jest.spyOn(productRepository, 'findAll').mockResolvedValue(products);

    const result = await service.execute({ active: true });
    expect(result).toEqual(products);
    expect(productRepository.findAll).toHaveBeenCalledWith({ active: true });
  });
});
