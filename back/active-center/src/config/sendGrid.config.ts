import { config as dotenvConfig } from 'dotenv';
import * as sgMail from '@sendgrid/mail';
import { InternalServerErrorException } from '@nestjs/common';

dotenvConfig({ path: `.env` });

export const SendGridConfig = {
  provide: 'SENDGRID',
  useFactory: () => {
    const sendGridApiKey = process.env.SENDGRID_API_KEY;

    if (!sendGridApiKey) {
      throw new InternalServerErrorException('error en la SENDGRID_API_KEY');
    }

    sgMail.setApiKey(sendGridApiKey);
    return sgMail;
  },
};
