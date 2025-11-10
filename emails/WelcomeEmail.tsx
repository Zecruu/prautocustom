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

interface WelcomeEmailProps {
  userName: string;
  userEmail: string;
  websiteUrl?: string;
  companyEmail?: string;
  companyPhone?: string;
}

export const WelcomeEmail = ({
  userName = 'Valued Customer',
  userEmail,
  websiteUrl = 'https://prautocustoms.com',
  companyEmail = 'info@prautocustom.com',
  companyPhone = '+1 (787) 123-4567',
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Bienvenido a PR Auto Custom - ¡Tu cuenta está lista!</Preview>
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

          <Heading style={h1}>¡Bienvenido a PR Auto Custom, {userName}!</Heading>

          <Text style={text}>
            Gracias por crear una cuenta con nosotros. ¡Estamos emocionados de tenerte como parte de nuestra comunidad!
          </Text>

          <Section style={accountBox}>
            <Heading style={h3Yellow}>Detalles de tu Cuenta:</Heading>
            <Text style={textWhite}>
              <strong>Email:</strong> {userEmail}
            </Text>
            <Text style={textWhite}>
              <strong>Estado de la Cuenta:</strong> Activa ✓
            </Text>
          </Section>

          <Heading style={h3}>¿Qué Sigue?</Heading>
          <Section style={list}>
            <Text style={listItem}>• Explora nuestros productos premium de personalización automotriz</Text>
            <Text style={listItem}>• Solicita cotizaciones para trabajos personalizados</Text>
            <Text style={listItem}>• Rastrea tus solicitudes de cotización y respuestas</Text>
            <Text style={listItem}>• Administra tu perfil y preferencias</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Si tienes alguna pregunta, no dudes en contactarnos a{' '}
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

export default WelcomeEmail;

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

const h3Yellow = {
  color: '#EAB308',
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

const accountBox = {
  backgroundColor: '#1e293b',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #334155',
};

const list = {
  margin: '16px 0',
};

const listItem = {
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

