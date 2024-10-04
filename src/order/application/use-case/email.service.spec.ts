import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { EmailProviderInterface } from '../domain/port/email-provider.interface';

describe('EmailService', () => {
  let service: EmailService;
  let emailProvider: EmailProviderInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: EmailProviderInterface,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    emailProvider = module.get<EmailProviderInterface>(EmailProviderInterface);
  });

  it('should send an email successfully', async () => {
    const emailData = { to: 'admin@test.fr', subject: 'Stock Alert', body: 'Stock is low' };
    jest.spyOn(emailProvider, 'send').mockResolvedValue(true);

    const result = await service.sendEmail(emailData);
    expect(result).toBe(true);
    expect(emailProvider.send).toHaveBeenCalledWith(emailData);
  });
});
