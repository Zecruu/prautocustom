import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { verificationCode } = await request.json();

    // Validate input
    if (!verificationCode) {
      return NextResponse.json(
        { error: 'Código de verificación requerido' },
        { status: 400 }
      );
    }

    // Get the authenticated user session
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find the user with the verification code
    const user = await User.findOne({ 
      email: session.user.email 
    }).select('+deletionVerificationCode +deletionVerificationExpires');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Check if verification code exists
    if (!user.deletionVerificationCode || !user.deletionVerificationExpires) {
      return NextResponse.json(
        { error: 'No se ha solicitado la eliminación de cuenta' },
        { status: 400 }
      );
    }

    // Check if code has expired
    if (new Date() > user.deletionVerificationExpires) {
      return NextResponse.json(
        { error: 'El código de verificación ha expirado. Solicita uno nuevo.' },
        { status: 400 }
      );
    }

    // Verify the code
    if (user.deletionVerificationCode !== verificationCode) {
      return NextResponse.json(
        { error: 'Código de verificación incorrecto' },
        { status: 400 }
      );
    }

    // Delete the user account
    await User.findByIdAndDelete(user._id);

    console.log('✅ Account deleted successfully:', user.email);

    return NextResponse.json(
      {
        message: 'Tu cuenta ha sido eliminada exitosamente',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Confirm account deletion error:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al eliminar tu cuenta' },
      { status: 500 }
    );
  }
}

