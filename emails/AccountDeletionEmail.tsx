import {
  Body,
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

interface AccountDeletionEmailProps {
  userName: string;
  verificationCode: string;
  websiteUrl?: string;
  companyEmail?: string;
  companyPhone?: string;
}

export const AccountDeletionEmail = ({
  userName = 'Usuario Valorado',
  verificationCode,
  websiteUrl = 'https://prautocustoms.com',
  companyEmail = 'info@prautocustom.com',
  companyPhone = '+1 (787) 123-4567',
}: AccountDeletionEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Código de verificación para eliminar tu cuenta de PR Auto Custom</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo Section */}
          <Section style={logoSection}>
            <Img
              src={`${websiteUrl}/logos/Logo Blanco.png`}
              alt="PR Auto Custom Logo"
              width="200"
              style={logo}
            />
          </Section>

          <Heading style={h1}>Solicitud de Eliminación de Cuenta</Heading>
          
          <Text style={text}>
            Hola {userName},
          </Text>

          <Text style={text}>
            Recibimos una solicitud para eliminar tu cuenta de PR Auto Custom. 
            Para confirmar esta acción, por favor usa el siguiente código de verificación:
          </Text>

          <Section style={codeBox}>
            <Text style={codeText}>{verificationCode}</Text>
          </Section>

          <Section style={warningBox}>
            <Heading style={h3Warning}>⚠️ Advertencia Importante</Heading>
            <Text style={warningText}>
              Esta acción es <strong>permanente e irreversible</strong>. Una vez eliminada tu cuenta:
            </Text>
            <Text style={warningText}>
              • Perderás acceso a todos tus datos
              <br />
              • Se eliminarán todas tus cotizaciones
              <br />
              • No podrás recuperar tu historial
              <br />
              • Tendrás que crear una nueva cuenta para usar nuestros servicios
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={infoBox}>
            <Heading style={h3}>¿No solicitaste esto?</Heading>
            <Text style={text}>
              Si no solicitaste eliminar tu cuenta, ignora este correo y tu cuenta permanecerá activa. 
              También te recomendamos cambiar tu contraseña por seguridad.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Si tienes alguna pregunta o necesitas ayuda, contáctanos por WhatsApp al{' '}
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

export default AccountDeletionEmail;

const main = {
  backgroundColor: '#0f172a',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
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
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '16px 0 12px',
};

const h3Warning = {
  color: '#ef4444',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const text = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const codeBox = {
  backgroundColor: '#1e293b',
  padding: '30px',
  borderRadius: '12px',
  margin: '32px 0',
  textAlign: 'center' as const,
  border: '2px solid #EAB308',
};

const codeText = {
  color: '#EAB308',
  fontSize: '36px',
  fontWeight: 'bold',
  letterSpacing: '8px',
  margin: '0',
  fontFamily: 'monospace',
};

const warningBox = {
  backgroundColor: '#7f1d1d',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
  border: '2px solid #ef4444',
};

const warningText = {
  color: '#fecaca',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '8px 0',
};

const infoBox = {
  backgroundColor: '#1e293b',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #334155',
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

