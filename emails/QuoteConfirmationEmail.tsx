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

const confirmBox = {
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

const messageText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  backgroundColor: '#F9FAFB',
  padding: '16px',
  borderRadius: '8px',
  borderLeft: '4px solid #EAB308',
  margin: '16px 0',
};

const addressText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  backgroundColor: '#F9FAFB',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0',
};

const infoBox = {
  backgroundColor: '#FEF3C7',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
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

