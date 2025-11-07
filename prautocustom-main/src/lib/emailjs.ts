import emailjs from '@emailjs/browser';

// Initialize EmailJS
export const initEmailJS = () => {
  emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY');
};

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

