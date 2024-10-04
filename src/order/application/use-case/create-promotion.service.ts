import { Promotion } from '../../domain/entity/promotion.entity';
import { PromotionRepositoryInterface } from '../../domain/port/persistence/promotion.repository.interface';
import { BadRequestException } from '@nestjs/common';

export class CreatePromotionService {
  constructor(private readonly promotionRepository: PromotionRepositoryInterface) {}

  async execute(promotionCommand: Partial<Promotion>): Promise<Promotion> {
    if (!promotionCommand.name || !promotionCommand.code) {
      throw new BadRequestException('Le nom et le code sont requis');
    }

    const promotion = new Promotion(promotionCommand);
    return await this.promotionRepository.save(promotion);
  }
}
