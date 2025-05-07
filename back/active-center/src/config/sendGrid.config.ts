import { config as dotenvConfig } from 'dotenv';
import * as sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import { ClientResponse } from '@sendgrid/client/src/response';
import { Logger } from '@nestjs/common';
import { Client } from '@sendgrid/client/src/client';

dotenvConfig({ path: `.env` });

const logger = new Logger('SendGridConfig');

// Interfaz que replica la estructura de la respuesta de SendGrid
type SendGridResponse = [ClientResponse, {}];

export const SendGridConfig = {
  provide: 'SENDGRID',
  useFactory: (): sgMail.MailService => {
    const sendGridApiKey = process.env.SENDGRID_API_KEY;

    if (!sendGridApiKey) {
      logger.warn('SENDGRID_API_KEY no está configurada. La funcionalidad de correo electrónico estará deshabilitada.');
      
      // Devolver un servicio mock que simula la interfaz de MailService pero no envía correos
      const mockMailService: sgMail.MailService = {
        send: async (message: MailDataRequired | MailDataRequired[]): Promise<SendGridResponse> => {
          if (Array.isArray(message)) {
            logger.log(`Email simulado a: ${message.map(m => Array.isArray(m.to) ? m.to.join(', ') : m.to).join(', ')}`);
          } else {
            logger.log(`Email simulado a: ${Array.isArray(message.to) ? message.to.join(', ') : message.to}`);
          }
          return [{ statusCode: 200, body: {}, headers: {} }, {}];
        },
        setApiKey: (apiKey: string): void => {
          // No hace nada en el mock
        },
        setSubstitutionWrappers: (): void => {},
        setTwilioEmailAuth: (): void => {},
        
        // Métodos adicionales requeridos por la interfaz MailService
        setClient: (client: Client): void => {},
        setTimeout: (timeout: number): void => {},
        sendMultiple: async (data: MailDataRequired): Promise<SendGridResponse> => {
          logger.log(`Email múltiple simulado`);
          return [{ statusCode: 200, body: {}, headers: {} }, {}];
        },
      };
      
      return mockMailService;
    }

    // Configuración normal cuando la API key está disponible
    sgMail.setApiKey(sendGridApiKey);
    return sgMail;
  },
};