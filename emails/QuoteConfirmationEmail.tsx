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

interface QuoteConfirmationEmailProps {
  clientName: string;
  quoteNumber: string;
  submissionDate: string;
  products: string[];
  message?: string;
  shippingAddress?: string;
  websiteUrl?: string;
  companyEmail?: string;
  companyPhone?: string;
}

export const QuoteConfirmationEmail = ({
  clientName = 'Valued Customer',
  quoteNumber,
  submissionDate,
  products = [],
  message,
  shippingAddress,
  websiteUrl = 'https://prautocustoms.com',
  companyEmail = 'info@prautocustom.com',
  companyPhone = '+1 (787) 123-4567',
}: QuoteConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Quote Request Received - Quote #{quoteNumber}</Preview>
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

          <Heading style={h1}>Hello {clientName},</Heading>
          
          <Text style={text}>
            Thank you for your quote request! We've received your inquiry and our team will review it shortly.
          </Text>

          <Section style={confirmBox}>
            <Heading style={h2}>Quote Request #{quoteNumber}</Heading>
            <Text style={textWhite}>
              <strong>Submitted:</strong> {submissionDate}
            </Text>
            <Text style={textWhite}>
              <strong>Status:</strong> Under Review
            </Text>
          </Section>

          <Heading style={h3}>Requested Products:</Heading>
          <Section style={productList}>
            {products.map((product, index) => (
              <Text key={index} style={productItem}>
                • {product}
              </Text>
            ))}
          </Section>

          {message && (
            <>
              <Heading style={h3}>Your Message:</Heading>
              <Text style={messageText}>{message}</Text>
            </>
          )}

          {shippingAddress && (
            <>
              <Heading style={h3}>Shipping Address:</Heading>
              <Text style={addressText}>{shippingAddress}</Text>
            </>
          )}

          <Hr style={hr} />

          <Section style={infoBox}>
            <Heading style={h3}>What Happens Next?</Heading>
            <Text style={text}>
              1. Our team will review your quote request
              <br />
              2. We'll prepare a detailed quote with pricing
              <br />
              3. You'll receive the quote via email within 24-48 hours
              <br />
              4. You can then decide whether to proceed with the order
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            If you have any questions or need to modify your request, please contact us at{' '}
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

export default QuoteConfirmationEmail;

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

const confirmBox = {
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

const messageText = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '26px',
  backgroundColor: '#1e293b',
  padding: '16px',
  borderRadius: '8px',
  borderLeft: '4px solid #EAB308',
  margin: '16px 0',
};

const addressText = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '26px',
  backgroundColor: '#1e293b',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0',
  border: '1px solid #334155',
};

const infoBox = {
  backgroundColor: '#713f12',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '2px solid #EAB308',
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

