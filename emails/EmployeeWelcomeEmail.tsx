import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface EmployeeWelcomeEmailProps {
  employeeName: string;
  employeeEmail: string;
  username: string;
  temporaryPassword: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://prautocustom.com';

export const EmployeeWelcomeEmail = ({
  employeeName = 'Empleado',
  employeeEmail = 'empleado@prautocustom.com',
  username = 'empleado123',
  temporaryPassword = '******',
}: EmployeeWelcomeEmailProps) => {
  const previewText = `¡Bienvenido al equipo de PR Auto Custom, ${employeeName}!`;

  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Img
              src={`${baseUrl}/logos/Logo%20Blanco.png`}
              alt="PR Auto Custom"
              width="150"
              height="auto"
              style={logo}
            />
          </Section>

          <Heading style={h1}>¡Bienvenido al Equipo, {employeeName}! 🎉</Heading>

          <Text style={text}>
            Nos complace darte la bienvenida a <strong>PR Auto Custom</strong>. Has sido agregado como empleado
            y ahora tienes acceso al portal administrativo de la empresa.
          </Text>

          {/* Login Credentials Box */}
          <Section style={credentialsBox}>
            <Heading style={h2}>🔐 Tus Credenciales de Acceso</Heading>
            <Text style={credentialText}>
              <strong>Correo Electrónico:</strong> {employeeEmail}
            </Text>
            <Text style={credentialText}>
              <strong>Nombre de Usuario:</strong> {username}
            </Text>
            <Text style={credentialText}>
              <strong>Contraseña Temporal:</strong> {temporaryPassword}
            </Text>
          </Section>

          <Section style={warningBox}>
            <Text style={warningText}>
              ⚠️ <strong>Importante:</strong> Por seguridad, te recomendamos cambiar tu contraseña después de
              iniciar sesión por primera vez.
            </Text>
          </Section>

          {/* Login Button */}
          <Section style={buttonContainer}>
            <Link href={`${baseUrl}/admin/signin`} style={button}>
              Iniciar Sesión en el Portal
            </Link>
          </Section>

          {/* Employee Portal Features */}
          <Section style={featuresBox}>
            <Heading style={h2}>📋 Tu Rol como Empleado</Heading>
            <Text style={text}>
              Como empleado de PR Auto Custom, tendrás acceso a las siguientes funcionalidades:
            </Text>

            <Section style={featureItem}>
              <Text style={featureTitle}>📊 Dashboard</Text>
              <Text style={featureDescription}>
                Visualiza estadísticas en tiempo real, cotizaciones pendientes, clientes activos y métricas
                importantes del negocio.
              </Text>
            </Section>

            <Section style={featureItem}>
              <Text style={featureTitle}>📝 Gestión de Cotizaciones</Text>
              <Text style={featureDescription}>
                Revisa, responde y gestiona todas las solicitudes de cotización de los clientes. Puedes agregar
                precios, notas y enviar respuestas directamente desde el portal.
              </Text>
            </Section>

            <Section style={featureItem}>
              <Text style={featureTitle}>✅ Informed (Solicitudes Informadas)</Text>
              <Text style={featureDescription}>
                Gestiona las solicitudes de clientes que desean ser informados cuando un producto esté disponible.
                Mantén a los clientes actualizados sobre el inventario.
              </Text>
            </Section>

            <Section style={featureItem}>
              <Text style={featureTitle}>👥 Gestión de Clientes</Text>
              <Text style={featureDescription}>
                Accede a la información de todos los clientes registrados, revisa su historial de cotizaciones
                y mantén un seguimiento de sus necesidades.
              </Text>
            </Section>

            <Section style={featureItem}>
              <Text style={featureTitle}>📦 Gestión de Productos</Text>
              <Text style={featureDescription}>
                Visualiza, edita y gestiona el catálogo completo de productos. Actualiza precios, descripciones,
                imágenes y disponibilidad de inventario.
              </Text>
            </Section>
          </Section>

          {/* How to Get Started */}
          <Section style={stepsBox}>
            <Heading style={h2}>🚀 Cómo Empezar</Heading>
            <Text style={stepText}>
              <strong>1.</strong> Haz clic en el botón "Iniciar Sesión en el Portal" arriba
            </Text>
            <Text style={stepText}>
              <strong>2.</strong> Ingresa tu nombre de usuario y contraseña temporal
            </Text>
            <Text style={stepText}>
              <strong>3.</strong> Cambia tu contraseña en la sección de Configuración
            </Text>
            <Text style={stepText}>
              <strong>4.</strong> Explora el dashboard y familiarízate con las herramientas
            </Text>
            <Text style={stepText}>
              <strong>5.</strong> ¡Comienza a gestionar cotizaciones y ayudar a nuestros clientes!
            </Text>
          </Section>

          {/* Support Section */}
          <Section style={supportBox}>
            <Heading style={h3}>💡 ¿Necesitas Ayuda?</Heading>
            <Text style={text}>
              Si tienes alguna pregunta sobre el portal o necesitas asistencia, no dudes en contactar al
              administrador o comunicarte con el equipo por WhatsApp.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Si tienes alguna pregunta, contáctanos por WhatsApp al{' '}
            <a href="https://wa.me/17877055536" style={link}>
              (787) 705-5536
            </a>
          </Text>

          <Text style={footer}>
            Saludos cordiales,
            <br />
            Equipo de PR Auto Custom
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EmployeeWelcomeEmail;

// Styles
const main = {
  backgroundColor: '#0f172a',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const h2 = {
  color: '#EAB308',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px 0 12px 0',
};

const h3 = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '16px 0 8px 0',
};

const text = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const credentialsBox = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const credentialText = {
  color: '#e2e8f0',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
  fontFamily: 'monospace',
};

const warningBox = {
  backgroundColor: '#7c2d12',
  border: '1px solid #ea580c',
  borderRadius: '8px',
  padding: '16px',
  margin: '20px 0',
};

const warningText = {
  color: '#fed7aa',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#EAB308',
  borderRadius: '8px',
  color: '#000000',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const featuresBox = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const featureItem = {
  marginBottom: '20px',
};

const featureTitle = {
  color: '#EAB308',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const featureDescription = {
  color: '#cbd5e1',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const stepsBox = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const stepText = {
  color: '#e2e8f0',
  fontSize: '15px',
  lineHeight: '26px',
  margin: '8px 0',
};

const supportBox = {
  backgroundColor: '#1e3a5f',
  border: '1px solid #3b82f6',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const hr = {
  borderColor: '#334155',
  margin: '32px 0',
};

const footer = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  margin: '16px 0',
};

const link = {
  color: '#EAB308',
  textDecoration: 'underline',
};

