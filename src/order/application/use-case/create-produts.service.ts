
import { BadRequestException } from '@nestjs/common';
import { Product } from '../src/order/domain/entity/product.entity';

export class ProductService {
  private products: Product[] = [];

  /**
   * Création d'un produit avec les règles métier définies.
   * @param name Nom du produit.
   * @param price Prix du produit.
   * @param description Description du produit.
   * @param stock Stock du produit (optionnel).
   * @returns Le produit créé.
   */
  createProduct(name: string, price: number, description: string, stock?: number): Product {
    if (!name || !price || !description) {
      throw new BadRequestException('Le nom, le prix et la description sont requis pour créer un produit.');
    }

    const product = new Product(name, price, stock ?? 0, description);
    this.products.push(product);

    return product;
  }
}
