import { Inject } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ContactFormDTO } from './sengridDTO/contactForm.dto';



export class SendGridService {
  constructor(
    @Inject('SENDGRID') private readonly sgMail: sgMail.MailService,
  ) {}

  async wellcomeMail(to: string): Promise<void> {
    const templateId = 'd-8c4aa8bdf6d24112b4f8dddea1f6363f';
    const senderMail = 'jumi.rc@hotmail.com';

    const mail = {
      to,
      from: senderMail,
      templateId: templateId,
    };
    try {
      await this.sgMail.send(mail);
    } catch (error) {
      console.error('Error enviando email:', error.response.body.errors);
    }
  }

  async reservationMail(
    id: string,
    user: string,
    date: Date,
    startTime: string,
    endTime: string,
    price?: number,
    spaces?: string,
    name?: string,
    linkStatus?: string,
  ) {
    const templateId = 'd-0d06ebcfc395429588eaaee2f1b1b724';
    const senderMail = 'jumi.rc@hotmail.com';

    const mail = {
      to: user,
      from: senderMail,
      templateId: templateId,
      dynamic_template_data: {
        id: id,
        date: date,
        startTime: startTime,
        endTime: endTime,
        price: price,
        spaces: spaces,
        userName: name,
        linkStatus:
          linkStatus ||
          'Acá iría el link para obtener el estado de la reserva mediante su id',
      },
    };
    try {
      await this.sgMail.send(mail);
    } catch (error) {
      console.error('Error enviando email:', error.response.body.errors);
    }
  }

  async orderEmail(
    id: string,
    date: Date,
    UserEmail: string,
    userName: string,
    items: any[],
    total: number,
    linkStatus?: string,
  ) {
    const products = items.map(({ product, quantity, price }) => ({
      name: product.name,
      quantity: quantity,
      price: price,
    }));

    const totalFixes = total.toFixed(2);

    const templateId = 'd-186b07f4f68246a98b199a3600e89f08';
    const senderMail = 'jumi.rc@hotmail.com';

    const mail = {
      to: UserEmail,
      date: date,
      from: senderMail,
      templateId: templateId,
      dynamic_template_data: {
        id: id,
        date: date,
        userName: userName,
        items: products,
        total: totalFixes,
        linkStatus:
          linkStatus ||
          'Acá iría el link para ver el estado de la orden segun el id',
      },
    };
      
      try {
        await this.sgMail.send(mail);
      } catch (error) {
        console.error('Error enviando email:', error.response.body.errors);
    } 
  };
    

  async contactMail(contactForm: ContactFormDTO): Promise<void>{

    const {name, phone, email, message} = contactForm;
    
    const senderMail = "jumi.rc@hotmail.com";
    const receiver = "jumicjv@gmail.com"
    const mail = {
      to: receiver,
      from: senderMail,
      subject: "Mail de consultas",
      text: `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\nMensaje: ${message}`
    };

    try {
      await this.sgMail.send(mail);
    } catch (error) {
      console.error('Error enviando email:', error.response.body.errors);
  } 
  }
  }
