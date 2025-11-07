import emailjs from '@emailjs/browser';

// Initialize EmailJS
export const initEmailJS = () => {
  emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY');
};

// Send quote request email to company
export const sendQuoteEmail = async (formData: {
  name: string;
  email: string;
  phone: string;
  rimSelection: string;
  message: string;
}) => {
  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
      {
        to_email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@prautocustom.com',
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        rim_selection: formData.rimSelection,
        message: formData.message,
      }
    );
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Send quote response to client
export const sendQuoteResponseEmail = async (data: {
  clientEmail: string;
  clientName: string;
  quoteNumber: string;
  validUntil: string;
  productDetails: string;
  subtotal: string;
  tax: string;
  total: string;
  notes?: string;
}) => {
  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
      process.env.NEXT_PUBLIC_EMAILJS_QUOTE_RESPONSE_TEMPLATE_ID || '',
      {
        to_email: data.clientEmail,
        client_name: data.clientName,
        quote_number: data.quoteNumber,
        valid_until: data.validUntil,
        product_details: data.productDetails,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        notes: data.notes || '',
        website_url: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://prautocustoms.com',
        company_email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@prautocustom.com',
        company_phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+1 (787) 123-4567',
      }
    );
    return response;
  } catch (error) {
    console.error('Error sending quote response email:', error);
    throw error;
  }
};

// Send welcome email on account creation
export const sendWelcomeEmail = async (data: {
  userEmail: string;
  userName: string;
}) => {
  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
      process.env.NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID || '',
      {
        to_email: data.userEmail,
        user_name: data.userName,
        user_email: data.userEmail,
        website_url: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://prautocustoms.com',
        company_email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@prautocustom.com',
        company_phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+1 (787) 123-4567',
      }
    );
    return response;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

// Send password change confirmation
export const sendPasswordChangeEmail = async (data: {
  userEmail: string;
  userName: string;
}) => {
  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
      process.env.NEXT_PUBLIC_EMAILJS_PASSWORD_CHANGE_TEMPLATE_ID || '',
      {
        to_email: data.userEmail,
        user_name: data.userName,
        user_email: data.userEmail,
        change_date: new Date().toLocaleString(),
        website_url: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://prautocustoms.com',
        company_email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@prautocustom.com',
        company_phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+1 (787) 123-4567',
      }
    );
    return response;
  } catch (error) {
    console.error('Error sending password change email:', error);
    throw error;
  }
};

// Send quote request confirmation to client
export const sendQuoteConfirmationEmail = async (data: {
  clientEmail: string;
  clientName: string;
  quoteNumber: string;
  submissionDate: string;
  productList: string;
  message?: string;
  shippingAddress?: string;
}) => {
  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
      process.env.NEXT_PUBLIC_EMAILJS_QUOTE_CONFIRMATION_TEMPLATE_ID || '',
      {
        to_email: data.clientEmail,
        client_name: data.clientName,
        quote_number: data.quoteNumber,
        submission_date: data.submissionDate,
        product_list: data.productList,
        message: data.message || '',
        shipping_address: data.shippingAddress || '',
        website_url: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://prautocustoms.com',
        company_email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@prautocustom.com',
        company_phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+1 (787) 123-4567',
      }
    );
    return response;
  } catch (error) {
    console.error('Error sending quote confirmation email:', error);
    throw error;
  }
};

