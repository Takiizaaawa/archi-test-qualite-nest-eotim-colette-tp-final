
export class ProductService {
  /**
   * Modification d'un produit existant.
   * @param productId Identifiant du produit à modifier.
   * @param name Nouveau nom du produit.
   * @param price Nouveau prix du produit.
   * @param description Nouvelle description du produit.
   * @param stock Nouveau stock du produit (optionnel).
   * @returns Le produit modifié.
   */
  updateProduct(productId: string, name: string, price: number, description: string, stock?: number): Product {
    const product = this.findProductById(productId);

    if (!product) {
      throw new BadRequestException('Produit non trouvé');
    }

    // Valider et mettre à jour les informations du produit
    product.setName(name);
    product.setPrice(price);
    product.setStock(stock ?? product.stock); // Si le stock n'est pas spécifié, conserver l'ancien.

    product.description = description;

    return product;
  }
}
