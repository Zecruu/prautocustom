import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface PasswordResetEmailProps {
  userName: string;
  resetLink: string;
  expiresIn?: string;
  websiteUrl?: string;
  companyEmail?: string;
  companyPhone?: string;
}

export const PasswordResetEmail = ({
  userName = 'Valued Customer',
  resetLink,
  expiresIn = '1 hour',
  websiteUrl = 'https://prautocustoms.com',
  companyEmail = 'info@prautocustom.com',
  companyPhone = '+1 (787) 123-4567',
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>
      <Preview>Restablece tu contraseña de PR Auto Custom</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo Section */}
          <Section style={logoSection}>
            <Img
              src={`${websiteUrl}/logos/Logo%20Blanco.png`}
              alt="PR Auto Custom Logo"
              width="200"
              style={logo}
            />
          </Section>

          <Heading style={h1}>Solicitud de Restablecimiento de Contraseña</Heading>

          <Text style={text}>
            Hola {userName},
          </Text>

          <Text style={text}>
            Recibimos una solicitud para restablecer tu contraseña de tu cuenta de PR Auto Custom.
            Haz clic en el botón de abajo para crear una nueva contraseña:
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetLink}>
              Restablecer Contraseña
            </Button>
          </Section>

          <Text style={text}>
            O copia y pega este enlace en tu navegador:
          </Text>

          <Text style={linkText}>
            {resetLink}
          </Text>

          <Section style={warningBox}>
            <Text style={warningText}>
              ⏰ <strong>Este enlace expirará en {expiresIn}.</strong>
            </Text>
            <Text style={warningText}>
              Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.
              Tu contraseña no será cambiada.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={securityBox}>
            <Heading style={h3}>Consejos de Seguridad:</Heading>
            <Text style={tipText}>
              • Nunca compartas tu contraseña con nadie
              <br />
              • Usa una contraseña fuerte y única
              <br />
              • No uses la misma contraseña en múltiples sitios
              <br />
              • Activa la autenticación de dos factores cuando esté disponible
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Si tienes alguna pregunta o no solicitaste este restablecimiento, contáctanos por WhatsApp al{' '}
            <a href="https://wa.me/17877055536" style={link}>
              (787) 705-5536
            </a>
          </Text>

          <Text style={footer}>
            Saludos cordiales,
            <br />
            Equipo de PR Auto Custom
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordResetEmail;

const main = {
  backgroundColor: '#0f172a !important' as any,
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
  backgroundColor: '#0f172a !important' as any,
};

const logoSection = {
  textAlign: 'center' as const,
  padding: '40px 0 20px',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const h3 = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '16px 0 12px',
};

const text = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const linkText = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '24px',
  wordBreak: 'break-all' as const,
  backgroundColor: '#1e293b',
  padding: '12px',
  borderRadius: '6px',
  margin: '16px 0',
  border: '1px solid #334155',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#EAB308',
  borderRadius: '8px',
  color: '#0f172a',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const warningBox = {
  backgroundColor: '#713f12',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
  border: '2px solid #EAB308',
};

const warningText = {
  color: '#fef3c7',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0',
};

const securityBox = {
  backgroundColor: '#1e293b',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #334155',
};

const tipText = {
  color: '#e2e8f0',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
};

const hr = {
  borderColor: '#334155',
  margin: '32px 0',
};

const footer = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '24px',
  marginTop: '16px',
};

const link = {
  color: '#EAB308',
  textDecoration: 'underline',
};

