import {
  Body,
  Button,
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
      <Head />
      <Preview>Reset your PR Auto Custom password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Password Reset Request</Heading>
          
          <Text style={text}>
            Hello {userName},
          </Text>

          <Text style={text}>
            We received a request to reset your password for your PR Auto Custom account. 
            Click the button below to create a new password:
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetLink}>
              Reset Password
            </Button>
          </Section>

          <Text style={text}>
            Or copy and paste this link into your browser:
          </Text>
          
          <Text style={linkText}>
            {resetLink}
          </Text>

          <Section style={warningBox}>
            <Text style={warningText}>
              ⏰ <strong>This link will expire in {expiresIn}.</strong>
            </Text>
            <Text style={warningText}>
              If you didn't request a password reset, you can safely ignore this email. 
              Your password will not be changed.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={securityBox}>
            <Heading style={h3}>Security Tips:</Heading>
            <Text style={tipText}>
              • Never share your password with anyone
              <br />
              • Use a strong, unique password
              <br />
              • Don't use the same password across multiple sites
              <br />
              • Enable two-factor authentication when available
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            If you have any questions or didn't request this reset, please contact us at{' '}
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

export default PasswordResetEmail;

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

const h3 = {
  color: '#1F2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '16px 0 12px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const linkText = {
  color: '#6B7280',
  fontSize: '14px',
  lineHeight: '24px',
  wordBreak: 'break-all' as const,
  backgroundColor: '#F3F4F6',
  padding: '12px',
  borderRadius: '6px',
  margin: '16px 0',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#EAB308',
  borderRadius: '8px',
  color: '#1F2937',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const warningBox = {
  backgroundColor: '#FEF3C7',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
  border: '2px solid #EAB308',
};

const warningText = {
  color: '#92400E',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0',
};

const securityBox = {
  backgroundColor: '#F9FAFB',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const tipText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
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

