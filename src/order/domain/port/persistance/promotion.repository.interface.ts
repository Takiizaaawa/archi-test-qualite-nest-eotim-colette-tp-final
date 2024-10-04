import { Promotion } from '../entity/promotion.entity';

export interface PromotionRepositoryInterface {
  save(promotion: Promotion): Promise<Promotion>;
  findByCode(code: string): Promise<Promotion | null>;
}
