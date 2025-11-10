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
      <Preview>Welcome to PR Auto Custom - Your account is ready!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to PR Auto Custom, {userName}!</Heading>
          
          <Text style={text}>
            Thank you for creating an account with us. We're excited to have you as part of our community!
          </Text>

          <Section style={accountBox}>
            <Heading style={h3Yellow}>Your Account Details:</Heading>
            <Text style={textWhite}>
              <strong>Email:</strong> {userEmail}
            </Text>
            <Text style={textWhite}>
              <strong>Account Status:</strong> Active ✓
            </Text>
          </Section>

          <Heading style={h3}>What's Next?</Heading>
          <Section style={list}>
            <Text style={listItem}>• Browse our premium automotive customization products</Text>
            <Text style={listItem}>• Request quotes for custom work</Text>
            <Text style={listItem}>• Track your quote requests and responses</Text>
            <Text style={listItem}>• Manage your profile and preferences</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            If you have any questions, feel free to contact us at{' '}
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

export default WelcomeEmail;

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

const accountBox = {
  backgroundColor: '#1F2937',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const list = {
  margin: '16px 0',
};

const listItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
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

