import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendAccountDeletionEmail } from '@/lib/resend';

// Generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find the user
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    
    // Set expiration time (15 minutes from now)
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 15);

    // Save verification code to user
    user.deletionVerificationCode = verificationCode;
    user.deletionVerificationExpires = expirationTime;
    await user.save();

    // Send verification email
    try {
      await sendAccountDeletionEmail({
        userEmail: user.email,
        userName: user.name,
        verificationCode: verificationCode,
      });
      console.log('✅ Account deletion verification email sent to:', user.email);
    } catch (emailError) {
      console.error('❌ Failed to send account deletion email:', emailError);
      return NextResponse.json(
        { error: 'Error al enviar el correo de verificación' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Código de verificación enviado a tu correo electrónico',
        expiresIn: '15 minutos',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Request account deletion error:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar tu solicitud' },
      { status: 500 }
    );
  }
}

