import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        visualizer: 'Visualizer',
        about: 'About',
        contact: 'Contact',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        profile: 'Profile',
        logout: 'Logout',
      },
      hero: {
        title: 'PR Auto Custom',
        subtitle: 'Premium Custom Rims & Wheels',
        cta: 'Start Customizing',
      },
      visualizer: {
        title: 'Interactive Rim Visualizer',
        selectRim: 'Select Your Rim',
        preview: 'Preview',
        requestQuote: 'Request Quote',
        noRimsAvailable: 'No rims available',
      },
      quote: {
        title: 'Request a Quote',
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        rimSelection: 'Selected Rim',
        message: 'Additional Notes',
        submit: 'Submit Quote Request',
        success: 'Quote request sent successfully!',
        error: 'Error sending quote request. Please try again.',
      },
      auth: {
        signIn: 'Sign In',
        signUp: 'Create Account',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        signInWithGoogle: 'Sign in with Google',
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: 'Already have an account?',
        forgotPassword: 'Forgot Password?',
      },
      profile: {
        myProfile: 'My Profile',
        editProfile: 'Edit Profile',
        myQuotes: 'My Quotes',
        settings: 'Settings',
        logout: 'Logout',
      },
    },
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        visualizer: 'Visualizador',
        about: 'Acerca de',
        contact: 'Contacto',
        signIn: 'Iniciar Sesión',
        signUp: 'Registrarse',
        profile: 'Perfil',
        logout: 'Cerrar Sesión',
      },
      hero: {
        title: 'PR Auto Custom',
        subtitle: 'Llantas y Rines Personalizados Premium',
        cta: 'Comenzar a Personalizar',
      },
      visualizer: {
        title: 'Visualizador Interactivo de Rines',
        selectRim: 'Selecciona tu Rin',
        preview: 'Vista Previa',
        requestQuote: 'Solicitar Cotización',
        noRimsAvailable: 'No hay rines disponibles',
      },
      quote: {
        title: 'Solicitar una Cotización',
        name: 'Nombre Completo',
        email: 'Correo Electrónico',
        phone: 'Número de Teléfono',
        rimSelection: 'Rin Seleccionado',
        message: 'Notas Adicionales',
        submit: 'Enviar Solicitud de Cotización',
        success: '¡Solicitud de cotización enviada exitosamente!',
        error: 'Error al enviar la solicitud. Por favor, intenta de nuevo.',
      },
      auth: {
        signIn: 'Iniciar Sesión',
        signUp: 'Crear Cuenta',
        email: 'Correo Electrónico',
        password: 'Contraseña',
        confirmPassword: 'Confirmar Contraseña',
        signInWithGoogle: 'Iniciar sesión con Google',
        dontHaveAccount: '¿No tienes cuenta?',
        alreadyHaveAccount: '¿Ya tienes cuenta?',
        forgotPassword: '¿Olvidaste tu contraseña?',
      },
      profile: {
        myProfile: 'Mi Perfil',
        editProfile: 'Editar Perfil',
        myQuotes: 'Mis Cotizaciones',
        settings: 'Configuración',
        logout: 'Cerrar Sesión',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

