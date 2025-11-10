import {
  Body,
  Container,
  Head,
  Heading,
  Html,
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
      <Preview>Your Quote from PR Auto Custom - Quote #{quoteNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Hello {clientName},</Heading>
          
          <Text style={text}>
            Thank you for your quote request! We're pleased to provide you with the following quote:
          </Text>

          <Section style={quoteBox}>
            <Heading style={h2}>Quote #{quoteNumber}</Heading>
            <Text style={textWhite}>
              <strong>Valid Until:</strong> {validUntil}
            </Text>
          </Section>

          <Hr style={hr} />

          <Heading style={h3}>Products & Pricing:</Heading>
          <Section style={productList}>
            {products.map((product, index) => (
              <Text key={index} style={productItem}>
                • {product.name} - ${product.price}
              </Text>
            ))}
          </Section>

          <Hr style={hr} />

          <Heading style={h3}>Summary:</Heading>
          <Section style={summary}>
            <Text style={summaryItem}>
              <strong>Subtotal:</strong> ${subtotal}
            </Text>
            <Text style={summaryItem}>
              <strong>Tax:</strong> ${tax}
            </Text>
            <Text style={totalText}>
              <strong>Total:</strong> ${total}
            </Text>
          </Section>

          {notes && (
            <>
              <Hr style={hr} />
              <Heading style={h3}>Additional Notes:</Heading>
              <Text style={notesText}>{notes}</Text>
            </>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            If you have any questions about this quote, please contact us at{' '}
            <a href={`mailto:${companyEmail}`} style={link}>
              {companyEmail}
            </a>{' '}
            or call us at {companyPhone}.
          </Text>

          <Text style={footer}>
            Best regards,
            <br />
            PR Auto Custom Team
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
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1F2937',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const h2 = {
  color: '#EAB308',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const h3 = {
  color: '#1F2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '24px 0 16px',
};

const text = {
  color: '#374151',
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
  backgroundColor: '#1F2937',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const productList = {
  margin: '16px 0',
};

const productItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '8px 0',
};

const summary = {
  margin: '16px 0',
};

const summaryItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '8px 0',
};

const totalText = {
  color: '#1F2937',
  fontSize: '20px',
  lineHeight: '30px',
  margin: '16px 0 0',
};

const notesText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  backgroundColor: '#F9FAFB',
  padding: '16px',
  borderRadius: '8px',
  borderLeft: '4px solid #EAB308',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '24px',
  marginTop: '16px',
};

const link = {
  color: '#EAB308',
  textDecoration: 'underline',
};

