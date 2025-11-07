// Server-side EmailJS using REST API
// This works in Next.js API routes (Node.js environment)

interface EmailJSResponse {
  status: number;
  text: string;
}

// Send welcome email on account creation (SERVER-SIDE)
export const sendWelcomeEmailServer = async (data: {
  userEmail: string;
  userName: string;
}): Promise<EmailJSResponse> => {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        template_id: process.env.NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID,
        user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: data.userEmail,
          user_name: data.userName,
          user_email: data.userEmail,
          website_url: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://prautocustoms.com',
          company_email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@prautocustom.com',
          company_phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+1 (787) 123-4567',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS API error: ${response.status} - ${errorText}`);
    }

    return {
      status: response.status,
      text: await response.text(),
    };
  } catch (error) {
    console.error('Error sending welcome email (server):', error);
    throw error;
  }
};

// Send quote response email to client (SERVER-SIDE)
export const sendQuoteResponseEmailServer = async (data: {
  clientEmail: string;
  clientName: string;
  quoteNumber: string;
  validUntil: string;
  productDetails: string;
  subtotal: string;
  tax: string;
  total: string;
  notes?: string;
}): Promise<EmailJSResponse> => {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        template_id: process.env.NEXT_PUBLIC_EMAILJS_QUOTE_RESPONSE_TEMPLATE_ID,
        user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        template_params: {
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
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS API error: ${response.status} - ${errorText}`);
    }

    return {
      status: response.status,
      text: await response.text(),
    };
  } catch (error) {
    console.error('Error sending quote response email (server):', error);
    throw error;
  }
};

// Send password change confirmation (SERVER-SIDE)
export const sendPasswordChangeEmailServer = async (data: {
  userEmail: string;
  userName: string;
}): Promise<EmailJSResponse> => {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        template_id: process.env.NEXT_PUBLIC_EMAILJS_PASSWORD_CHANGE_TEMPLATE_ID,
        user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: data.userEmail,
          user_name: data.userName,
          user_email: data.userEmail,
          change_date: new Date().toLocaleString(),
          website_url: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://prautocustoms.com',
          company_email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@prautocustom.com',
          company_phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+1 (787) 123-4567',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS API error: ${response.status} - ${errorText}`);
    }

    return {
      status: response.status,
      text: await response.text(),
    };
  } catch (error) {
    console.error('Error sending password change email (server):', error);
    throw error;
  }
};

// Send quote request confirmation to client (SERVER-SIDE)
export const sendQuoteConfirmationEmailServer = async (data: {
  clientEmail: string;
  clientName: string;
  quoteNumber: string;
  submissionDate: string;
  productList: string;
  message?: string;
  shippingAddress?: string;
}): Promise<EmailJSResponse> => {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        template_id: process.env.NEXT_PUBLIC_EMAILJS_QUOTE_CONFIRMATION_TEMPLATE_ID,
        user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        template_params: {
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
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS API error: ${response.status} - ${errorText}`);
    }

    return {
      status: response.status,
      text: await response.text(),
    };
  } catch (error) {
    console.error('Error sending quote confirmation email (server):', error);
    throw error;
  }
};

