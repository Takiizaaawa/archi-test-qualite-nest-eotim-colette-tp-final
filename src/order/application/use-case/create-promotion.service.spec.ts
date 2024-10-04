import { Test, TestingModule } from '@nestjs/testing';
import { CreatePromotionService } from './create-promotion.service';
import { PromotionRepositoryInterface } from '../domain/port/persistence/promotion.repository.interface';
import { Promotion } from '../domain/entity/promotion.entity';
import { BadRequestException } from '@nestjs/common';

describe('CreatePromotionService', () => {
  let service: CreatePromotionService;
  let promotionRepository: PromotionRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePromotionService,
        {
          provide: PromotionRepositoryInterface,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreatePromotionService>(CreatePromotionService);
    promotionRepository = module.get<PromotionRepositoryInterface>(PromotionRepositoryInterface);
  });

  it('should create a promotion successfully', async () => {
    const promoData = { name: 'Black Friday', code: 'BF2024', amount: 500 };
    const promotion = new Promotion(promoData);

    jest.spyOn(promotionRepository, 'save').mockResolvedValue(promotion);

    const result = await service.execute(promoData);
    expect(result).toEqual(promotion);
    expect(promotionRepository.save).toHaveBeenCalledWith(expect.objectContaining(promoData));
  });

  it('should throw an error if name or code is missing', async () => {
    await expect(service.execute({ name: '', code: 'BF2024' })).rejects.toThrow(BadRequestException);
  });

  it('should set default amount to 1500 if not provided', async () => {
    const promoData = { name: 'Cyber Monday', code: 'CM2024' };

    const promotion = new Promotion({ ...promoData, amount: 1500 });
    jest.spyOn(promotionRepository, 'save').mockResolvedValue(promotion);

    const result = await service.execute(promoData);
    expect(result.amount).toBe(1500);
  });
});
