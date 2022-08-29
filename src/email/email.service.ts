import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  send = (receiver, confirmLink): void => {
    this.mailerService
      .sendMail({
        to: receiver,
        from: 'my_service@gmail.com',
        subject: 'Confirm your email ✔',
        template: 'email-confirmation',
        context: {
          receiver,
          confirmLink,
        },
      })
      .then((success) => {
        console.info(success);
      })
      .catch((err) => {
        console.error(err);
      });
  };
}
