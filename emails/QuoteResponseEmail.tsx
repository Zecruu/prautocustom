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

interface QuoteResponseEmailProps {
  clientName: string;
  quoteNumber: string;
  validUntil: string;
  products: Array<{
    name: string;
    price: string;
  }>;
  subtotal: string;
  tax: string;
  total: string;
  notes?: string;
  websiteUrl?: string;
  companyEmail?: string;
  companyPhone?: string;
}

export const QuoteResponseEmail = ({
  clientName = 'Valued Customer',
  quoteNumber,
  validUntil,
  products = [],
  subtotal,
  tax,
  total,
  notes,
  websiteUrl = 'https://prautocustoms.com',
  companyEmail = 'info@prautocustom.com',
  companyPhone = '+1 (787) 123-4567',
}: QuoteResponseEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Tu Cotización de PR Auto Custom - Cotización #{quoteNumber}</Preview>
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

          <Heading style={h1}>Hola {clientName},</Heading>

          <Text style={text}>
            ¡Gracias por tu solicitud de cotización! Nos complace proporcionarte la siguiente cotización:
          </Text>

          <Section style={quoteBox}>
            <Heading style={h2}>Cotización #{quoteNumber}</Heading>
            <Text style={textWhite}>
              <strong>Válida Hasta:</strong> {validUntil}
            </Text>
          </Section>

          <Hr style={hr} />

          <Heading style={h3}>Productos y Precios:</Heading>
          <Section style={productList}>
            {products.map((product, index) => (
              <Text key={index} style={productItem}>
                • {product.name} - ${product.price}
              </Text>
            ))}
          </Section>

          <Hr style={hr} />

          <Heading style={h3}>Resumen:</Heading>
          <Section style={summary}>
            <Text style={summaryItem}>
              <strong>Subtotal:</strong> ${subtotal}
            </Text>
            <Text style={summaryItem}>
              <strong>Impuesto:</strong> ${tax}
            </Text>
            <Text style={totalText}>
              <strong>Total:</strong> ${total}
            </Text>
          </Section>

          {notes && (
            <>
              <Hr style={hr} />
              <Heading style={h3}>Notas Adicionales:</Heading>
              <Text style={notesText}>{notes}</Text>
            </>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            Si tienes alguna pregunta sobre esta cotización, contáctanos a{' '}
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

export default QuoteResponseEmail;

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

const h2 = {
  color: '#EAB308',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const h3 = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '24px 0 16px',
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

const quoteBox = {
  backgroundColor: '#1e293b',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #334155',
};

const productList = {
  margin: '16px 0',
};

const productItem = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '8px 0',
};

const summary = {
  margin: '16px 0',
};

const summaryItem = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '8px 0',
};

const totalText = {
  color: '#EAB308',
  fontSize: '20px',
  lineHeight: '30px',
  margin: '16px 0 0',
  fontWeight: 'bold',
};

const notesText = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '26px',
  backgroundColor: '#1e293b',
  padding: '16px',
  borderRadius: '8px',
  borderLeft: '4px solid #EAB308',
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

