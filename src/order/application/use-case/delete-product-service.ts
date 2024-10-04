
export class ProductService {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  /**
   * Suppression d'un produit en vérifiant s'il est lié à une commande.
   * @param productId L'identifiant du produit.
   */
  deleteProduct(productId: string): void {
    const product = this.findProductById(productId);

    if (!product) {
      throw new BadRequestException('Produit non trouvé');
    }

    const isLinkedToOrder = this.orderService.isProductLinkedToOrder(productId);

    if (isLinkedToOrder) {
      throw new BadRequestException('Impossible de supprimer un produit lié à une commande.');
    }

    this.products = this.products.filter(p => p.id !== productId);
  }

  private findProductById(productId: string): Product | undefined {
    return this.products.find(product => product.id === productId);
  }
}
