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
      <Preview>Your PR Auto Custom password has been changed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Password Changed Successfully</Heading>
          
          <Text style={text}>
            Hello {userName},
          </Text>

          <Text style={text}>
            This email confirms that your password for your PR Auto Custom account was recently changed.
          </Text>

          <Section style={infoBox}>
            <Text style={textWhite}>
              <strong>Account:</strong> {userEmail}
            </Text>
            <Text style={textWhite}>
              <strong>Changed On:</strong> {changeDate}
            </Text>
          </Section>

          <Section style={warningBox}>
            <Heading style={h3Warning}>Didn't make this change?</Heading>
            <Text style={warningText}>
              If you did not change your password, please contact us immediately at{' '}
              <a href={`mailto:${companyEmail}`} style={linkWhite}>
                {companyEmail}
              </a>{' '}
              or call {companyPhone}.
            </Text>
            <Text style={warningText}>
              Your account security is important to us. We recommend changing your password immediately if this wasn't you.
            </Text>
          </Section>

          <Hr style={hr} />

          <Heading style={h3}>Security Tips:</Heading>
          <Section style={tipsList}>
            <Text style={tipItem}>• Use a strong, unique password for your account</Text>
            <Text style={tipItem}>• Never share your password with anyone</Text>
            <Text style={tipItem}>• Enable two-factor authentication if available</Text>
            <Text style={tipItem}>• Regularly update your password</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            If you have any questions or concerns, please contact us at{' '}
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

export default PasswordChangeEmail;

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

const h3Warning = {
  color: '#DC2626',
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

const warningText = {
  color: '#7F1D1D',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '8px 0',
};

const infoBox = {
  backgroundColor: '#1F2937',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const warningBox = {
  backgroundColor: '#FEE2E2',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '2px solid #DC2626',
};

const tipsList = {
  margin: '16px 0',
};

const tipItem = {
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

const linkWhite = {
  color: '#DC2626',
  textDecoration: 'underline',
  fontWeight: 'bold',
};

