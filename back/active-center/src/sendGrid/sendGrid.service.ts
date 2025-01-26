/* eslint-disable prettier/prettier */
import { Inject } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

export class SendGridService {
    constructor(
        @Inject('SENDGRID') private readonly sgMail: sgMail.MailService
    ){}

    async wellcomeMail( to: string): Promise<void>{
        const templateId = "d-8c4aa8bdf6d24112b4f8dddea1f6363f";
        const senderMail = "jumi.rc@hotmail.com";

        const mail = {
            to,
            from: senderMail,
            templateId: templateId
        }
        try {
            await this.sgMail.send(mail);
            console.log('Email enviado correctamente');
          } catch (error) {
            console.error('Error enviando email:', error.response.body.errors);
            throw new Error('Error sending email');
          }
          
    }
    
}
