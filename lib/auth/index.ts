import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../prisma';
import * as brevo from '@getbrevo/brevo';

// Configurar Brevo API
const brevoApiInstance = new brevo.TransactionalEmailsApi();
brevoApiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      try {
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = 'Verifica tu correo electrónico';
        sendSmtpEmail.to = [{ email: user.email, name: user.name || '' }];
        sendSmtpEmail.htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0066CC;">Verifica tu correo electrónico</h2>
            <p>Hola${user.name ? ` ${user.name}` : ''},</p>
            <p>Gracias por registrarte en nuestro Sistema de Gestión Financiera. Para completar tu registro, por favor verifica tu correo electrónico haciendo clic en el siguiente enlace:</p>
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #0066CC; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
              Verificar correo electrónico
            </a>
            <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
            <p style="color: #666; font-size: 12px; margin-top: 40px;">Este enlace expirará en 1 hora.</p>
          </div>
        `;
        sendSmtpEmail.sender = {
          name: 'Sistema Gestión Financiera',
          email: process.env.EMAIL_FROM || 'noreply@example.com',
        };

        await brevoApiInstance.sendTransacEmail(sendSmtpEmail);
      } catch (error) {
        // Si falla el envío, logueamos pero no bloqueamos el registro
        if (process.env.NODE_ENV === 'development') {
          console.error('Error enviando email de verificación:', error);
          console.log('URL de verificación:', url);
        }
        throw error; // Re-lanzar para que Better Auth lo maneje
      }
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'USER',
        input: false,
      },
      phone: {
        type: 'string',
        required: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export { prisma };
