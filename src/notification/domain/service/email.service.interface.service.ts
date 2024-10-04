export interface EmailServiceInterface {
  sendLowStockAlert(product: Product): Promise<void>;
}
