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

interface PasswordChangeEmailProps {
  userName: string;
  userEmail: string;
  changeDate: string;
  websiteUrl?: string;
  companyEmail?: string;
  companyPhone?: string;
}

export const PasswordChangeEmail = ({
  userName = 'Valued Customer',
  userEmail,
  changeDate,
  websiteUrl = 'https://prautocustoms.com',
  companyEmail = 'info@prautocustom.com',
  companyPhone = '+1 (787) 123-4567',
}: PasswordChangeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Tu contraseña de PR Auto Custom ha sido cambiada</Preview>
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

          <Heading style={h1}>Contraseña Cambiada Exitosamente</Heading>

          <Text style={text}>
            Hola {userName},
          </Text>

          <Text style={text}>
            Este correo confirma que la contraseña de tu cuenta de PR Auto Custom fue cambiada recientemente.
          </Text>

          <Section style={infoBox}>
            <Text style={textWhite}>
              <strong>Cuenta:</strong> {userEmail}
            </Text>
            <Text style={textWhite}>
              <strong>Cambiada el:</strong> {changeDate}
            </Text>
          </Section>

          <Section style={warningBox}>
            <Heading style={h3Warning}>¿No hiciste este cambio?</Heading>
            <Text style={warningText}>
              Si no cambiaste tu contraseña, por favor contáctanos inmediatamente a{' '}
              <a href={`mailto:${companyEmail}`} style={linkWhite}>
                {companyEmail}
              </a>{' '}
              o llama al {companyPhone}.
            </Text>
            <Text style={warningText}>
              La seguridad de tu cuenta es importante para nosotros. Te recomendamos cambiar tu contraseña inmediatamente si no fuiste tú.
            </Text>
          </Section>

          <Hr style={hr} />

          <Heading style={h3}>Consejos de Seguridad:</Heading>
          <Section style={tipsList}>
            <Text style={tipItem}>• Usa una contraseña fuerte y única para tu cuenta</Text>
            <Text style={tipItem}>• Nunca compartas tu contraseña con nadie</Text>
            <Text style={tipItem}>• Activa la autenticación de dos factores si está disponible</Text>
            <Text style={tipItem}>• Actualiza tu contraseña regularmente</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Si tienes alguna pregunta o inquietud, contáctanos a{' '}
            <a href={`mailto:${companyEmail}`} style={link}>
              {companyEmail}
            </a>{' '}
            o llámanos al {companyPhone}.
          </Text>

          <Text style={footer}>
            Saludos cordiales,
            <br />
            Equipo de PR Auto Custom
            <br />
            {companyEmail}
            <br />
            {companyPhone}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordChangeEmail;

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
  margin: '24px 0 16px',
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
};

const textWhite = {
  color: '#ffffff',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '8px 0',
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

const warningBox = {
  backgroundColor: '#7f1d1d',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '2px solid #ef4444',
};

const tipsList = {
  margin: '16px 0',
};

const tipItem = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '26px',
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

const linkWhite = {
  color: '#fca5a5',
  textDecoration: 'underline',
  fontWeight: 'bold',
};

