import { Resend } from 'resend';
import WelcomeEmail from '../../emails/WelcomeEmail';
import QuoteResponseEmail from '../../emails/QuoteResponseEmail';
import QuoteConfirmationEmail from '../../emails/QuoteConfirmationEmail';
import PasswordChangeEmail from '../../emails/PasswordChangeEmail';
import PasswordResetEmail from '../../emails/PasswordResetEmail';
import AccountDeletionEmail from '../../emails/AccountDeletionEmail';
import EmployeeWelcomeEmail from '../../emails/EmployeeWelcomeEmail';

// Initialize Resend with API key or a placeholder for build time
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_for_build');

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com';
const COMPANY_EMAIL = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@prautocustom.com';
const COMPANY_PHONE = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+1 (787) 123-4567';
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://prautocustoms.com';

interface ResendResponse {
  id?: string;
  error?: unknown;
}

// Send welcome email on account creation
export const sendWelcomeEmail = async (data: {
  userEmail: string;
  userName: string;
}): Promise<ResendResponse> => {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder_for_build') {
      console.warn('⚠️ Resend API key not configured. Email not sent.');
      return { error: 'Resend API key not configured' };
    }

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      subject: 'Welcome to PR Auto Custom!',
      react: WelcomeEmail({
        userName: data.userName,
        userEmail: data.userEmail,
        websiteUrl: WEBSITE_URL,
        companyEmail: COMPANY_EMAIL,
        companyPhone: COMPANY_PHONE,
      }),
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { error };
    }

    console.log('✅ Welcome email sent:', emailData?.id);
    return { id: emailData?.id };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

// Send quote response email to client
export const sendQuoteResponseEmail = async (data: {
  clientEmail: string;
  clientName: string;
  quoteNumber: string;
  validUntil: string;
  products: Array<{ name: string; price: string }>;
  subtotal: string;
  tax: string;
  total: string;
  notes?: string;
  replyTo?: string; // Optional: Set reply-to address
}): Promise<ResendResponse> => {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder_for_build') {
      console.warn('⚠️ Resend API key not configured. Email not sent.');
      return { error: 'Resend API key not configured' };
    }

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.clientEmail,
      replyTo: data.replyTo || COMPANY_EMAIL, // Replies go to this address
      subject: `Quote Response from PR Auto Custom - Quote #${data.quoteNumber}`,
      react: QuoteResponseEmail({
        clientName: data.clientName,
        quoteNumber: data.quoteNumber,
        validUntil: data.validUntil,
        products: data.products,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        notes: data.notes,
        websiteUrl: WEBSITE_URL,
        companyEmail: COMPANY_EMAIL,
        companyPhone: COMPANY_PHONE,
      }),
    });

    if (error) {
      console.error('Error sending quote response email:', error);
      return { error };
    }

    console.log('✅ Quote response email sent:', emailData?.id);
    return { id: emailData?.id };
  } catch (error) {
    console.error('Error sending quote response email:', error);
    throw error;
  }
};

// Send quote request confirmation to client
export const sendQuoteConfirmationEmail = async (data: {
  clientEmail: string;
  clientName: string;
  quoteNumber: string;
  submissionDate: string;
  products: string[] | Array<{ name: string; image?: string; quantity?: number }>;
  message?: string;
  shippingAddress?: string;
  replyTo?: string; // Optional: Set reply-to address
}): Promise<ResendResponse> => {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder_for_build') {
      console.warn('⚠️ Resend API key not configured. Email not sent.');
      return { error: 'Resend API key not configured' };
    }

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.clientEmail,
      replyTo: data.replyTo || COMPANY_EMAIL, // Replies go to this address
      subject: `Quote Request Received - Quote #${data.quoteNumber}`,
      react: QuoteConfirmationEmail({
        clientName: data.clientName,
        quoteNumber: data.quoteNumber,
        submissionDate: data.submissionDate,
        products: data.products,
        message: data.message,
        shippingAddress: data.shippingAddress,
        websiteUrl: WEBSITE_URL,
        companyEmail: COMPANY_EMAIL,
        companyPhone: COMPANY_PHONE,
      }),
    });

    if (error) {
      console.error('Error sending quote confirmation email:', error);
      return { error };
    }

    console.log('✅ Quote confirmation email sent:', emailData?.id);
    return { id: emailData?.id };
  } catch (error) {
    console.error('Error sending quote confirmation email:', error);
    throw error;
  }
};

// Send password change confirmation
export const sendPasswordChangeEmail = async (data: {
  userEmail: string;
  userName: string;
}): Promise<ResendResponse> => {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder_for_build') {
      console.warn('⚠️ Resend API key not configured. Email not sent.');
      return { error: 'Resend API key not configured' };
    }

    const changeDate = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      subject: 'Your PR Auto Custom Password Has Been Changed',
      react: PasswordChangeEmail({
        userName: data.userName,
        userEmail: data.userEmail,
        changeDate,
        websiteUrl: WEBSITE_URL,
        companyEmail: COMPANY_EMAIL,
        companyPhone: COMPANY_PHONE,
      }),
    });

    if (error) {
      console.error('Error sending password change email:', error);
      return { error };
    }

    console.log('✅ Password change email sent:', emailData?.id);
    return { id: emailData?.id };
  } catch (error) {
    console.error('Error sending password change email:', error);
    throw error;
  }
};

// Send quote request notification to company (with client's email as reply-to)
export const sendQuoteRequestToCompany = async (data: {
  clientEmail: string;
  clientName: string;
  clientPhone: string;
  quoteNumber: string;
  products: string[] | Array<{ name: string; image?: string; quantity?: number }>;
  message?: string;
  shippingAddress?: string;
}): Promise<ResendResponse> => {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder_for_build') {
      console.warn('⚠️ Resend API key not configured. Email not sent.');
      return { error: 'Resend API key not configured' };
    }

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: COMPANY_EMAIL, // Send to your company email
      replyTo: data.clientEmail, // When you hit reply, it goes to the client!
      subject: `New Quote Request #${data.quoteNumber} from ${data.clientName}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Quote Number:</strong> ${data.quoteNumber}</p>
        <p><strong>Client Name:</strong> ${data.clientName}</p>
        <p><strong>Client Email:</strong> ${data.clientEmail}</p>
        <p><strong>Client Phone:</strong> ${data.clientPhone}</p>

        <h3>Requested Products:</h3>
        <ul>
          ${data.products.map(p => typeof p === 'string' ? `<li>${p}</li>` : `<li>${p.name}${p.quantity ? ` (Qty: ${p.quantity})` : ''}</li>`).join('')}
        </ul>

        ${data.message ? `
          <h3>Message:</h3>
          <p>${data.message}</p>
        ` : ''}

        ${data.shippingAddress ? `
          <h3>Shipping Address:</h3>
          <p>${data.shippingAddress}</p>
        ` : ''}

        <hr>
        <p><em>Click "Reply" to respond directly to ${data.clientName}</em></p>
      `,
    });

    if (error) {
      console.error('Error sending quote request to company:', error);
      return { error };
    }

    console.log('✅ Quote request sent to company:', emailData?.id);
    return { id: emailData?.id };
  } catch (error) {
    console.error('Error sending quote request to company:', error);
    throw error;
  }
};



// Send password reset email
export const sendPasswordResetEmail = async (data: {
  userEmail: string;
  userName: string;
  resetLink: string;
}): Promise<ResendResponse> => {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder_for_build') {
      console.warn('⚠️ Resend API key not configured. Email not sent.');
      return { error: 'Resend API key not configured' };
    }

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      subject: 'Reset Your PR Auto Custom Password',
      react: PasswordResetEmail({
        userName: data.userName,
        resetLink: data.resetLink,
        expiresIn: '1 hour',
        websiteUrl: WEBSITE_URL,
        companyEmail: COMPANY_EMAIL,
        companyPhone: COMPANY_PHONE,
      }),
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return { error };
    }

    console.log('✅ Password reset email sent:', emailData?.id);
    return { id: emailData?.id };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send account deletion verification email
export const sendAccountDeletionEmail = async (data: {
  userEmail: string;
  userName: string;
  verificationCode: string;
}): Promise<ResendResponse> => {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder_for_build') {
      console.warn('⚠️ Resend API key not configured. Email not sent.');
      return { error: 'Resend API key not configured' };
    }

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      subject: 'Código de Verificación para Eliminar tu Cuenta - PR Auto Custom',
      react: AccountDeletionEmail({
        userName: data.userName,
        verificationCode: data.verificationCode,
        websiteUrl: WEBSITE_URL,
        companyEmail: COMPANY_EMAIL,
        companyPhone: COMPANY_PHONE,
      }),
    });

    if (error) {
      console.error('Error sending account deletion email:', error);
      return { error };
    }

    console.log('✅ Account deletion email sent:', emailData?.id);
    return { id: emailData?.id };
  } catch (error) {
    console.error('Error sending account deletion email:', error);
    throw error;
  }
};

// Send employee welcome email with login credentials
export const sendEmployeeWelcomeEmail = async (data: {
  employeeEmail: string;
  employeeName: string;
  username: string;
  temporaryPassword: string;
}): Promise<ResendResponse> => {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder_for_build') {
      console.warn('⚠️ Resend API key not configured. Email not sent.');
      return { error: 'Resend API key not configured' };
    }

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.employeeEmail,
      subject: '¡Bienvenido al Equipo de PR Auto Custom! 🎉',
      react: EmployeeWelcomeEmail({
        employeeName: data.employeeName,
        employeeEmail: data.employeeEmail,
        username: data.username,
        temporaryPassword: data.temporaryPassword,
      }),
    });

    if (error) {
      console.error('Error sending employee welcome email:', error);
      return { error };
    }

    console.log('✅ Employee welcome email sent:', emailData?.id);
    return { id: emailData?.id };
  } catch (error) {
    console.error('Error sending employee welcome email:', error);
    throw error;
  }
};
