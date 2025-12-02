import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendWelcomeEmail } from '@/lib/resend';

// Verify Cloudflare Turnstile token
async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.warn('⚠️ Turnstile secret key not configured');
    return true; // Allow in development
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

// Check if name looks like bot-generated gibberish
function isGibberishName(name: string): boolean {
  // Trim and get the cleaned name
  const cleanName = name.trim();

  // Check minimum length
  if (cleanName.length < 2) return true;

  // Check for too many consecutive consonants (more than 4)
  const consonantPattern = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{5,}/;
  if (consonantPattern.test(cleanName)) return true;

  // Check for too many uppercase letters in a row (more than 3)
  const uppercasePattern = /[A-Z]{4,}/;
  if (uppercasePattern.test(cleanName)) return true;

  // Check for mixed case gibberish patterns (lowercase immediately followed by uppercase multiple times)
  const mixedCaseCount = (cleanName.match(/[a-z][A-Z]/g) || []).length;
  if (mixedCaseCount > 3) return true;

  // Check for suspicious character distribution (name should have some vowels)
  const vowelCount = (cleanName.match(/[aeiouAEIOU]/g) || []).length;
  const letterCount = (cleanName.match(/[a-zA-Z]/g) || []).length;
  if (letterCount > 5 && vowelCount / letterCount < 0.15) return true;

  // Check for random string patterns (too many unique character transitions)
  const uniqueTransitions = new Set();
  for (let i = 0; i < cleanName.length - 1; i++) {
    uniqueTransitions.add(cleanName[i].toLowerCase() + cleanName[i + 1].toLowerCase());
  }
  if (cleanName.length > 8 && uniqueTransitions.size / cleanName.length > 0.9) return true;

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, turnstileToken } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Verify Turnstile CAPTCHA (skip if not configured for dev)
    if (process.env.TURNSTILE_SECRET_KEY) {
      if (!turnstileToken) {
        return NextResponse.json(
          { error: 'Security verification required' },
          { status: 400 }
        );
      }

      const isValidToken = await verifyTurnstile(turnstileToken);
      if (!isValidToken) {
        return NextResponse.json(
          { error: 'Security verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // Check for bot-like gibberish names
    if (isGibberishName(name)) {
      return NextResponse.json(
        { error: 'Please enter a valid name' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create new user (password will be hashed by the pre-save hook)
    const user = await User.create({
      email,
      password,
      name,
      role: 'client', // Default role for new signups
    });

    // Send welcome email (don't fail signup if email fails)
    try {
      await sendWelcomeEmail({
        userEmail: user.email,
        userName: user.name,
      });
      console.log('✅ Welcome email sent to:', user.email);
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError);
      // Continue - account is still created
    }

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}

