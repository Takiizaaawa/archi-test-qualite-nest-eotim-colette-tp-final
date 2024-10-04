import { EmailServiceInterface } from 'src/notification/domain/service/email.service.interface';
import { Product } from 'src/product/domain/entity/product.entity';
import * as nodemailer from 'nodemailer';

export class EmailService implements EmailServiceInterface {
  private transporter;

  constructor() {
    // Configuration de nodemailer avec SMTP (ou un service d'email)
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // ou un autre service
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password',
      },
    });
  }

  async sendLowStockAlert(product: Product): Promise<void> {
    const mailOptions = {
      from: 'noreply@test.fr',
      to: 'admin@test.fr',
      subject: `Stock épuisé pour le produit ${product.name}`,
      text: `Le stock du produit ${product.name} (ID: ${product.id}) a atteint 0. Veuillez réapprovisionner.`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
