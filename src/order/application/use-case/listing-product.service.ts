export class ProductService {
  /**
   * Liste des produits avec possibilité de filtrer par statut (actif ou non).
   * @param isActive Filtre sur les produits actifs (optionnel).
   * @returns Liste des produits filtrée.
   */
  listProducts(isActive?: boolean): Product[] {
    if (isActive !== undefined) {
      return this.products.filter(product => product.isActive === isActive);
    }

    return this.products;
  }
}
