import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET - List all users (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can view user list
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 });
    }

    await connectDB();

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST - Create new user (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can create users
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 });
    }

    const { email, name, username, password, role } = await request.json();

    // Validation
    if (!email || !name || !password || !role) {
      return NextResponse.json({ 
        error: 'Email, name, password, and role are required' 
      }, { status: 400 });
    }

    // For admin/employee users, username is required
    if ((role === 'admin' || role === 'employee') && !username) {
      return NextResponse.json({ 
        error: 'Username is required for admin and employee accounts' 
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        error: 'Password must be at least 6 characters' 
      }, { status: 400 });
    }

    if (!['admin', 'employee', 'client'].includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role. Must be admin, employee, or client' 
      }, { status: 400 });
    }

    await connectDB();

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return NextResponse.json({ 
        error: 'Email already exists' 
      }, { status: 400 });
    }

    // Check if username already exists (for admin/employee)
    if (username) {
      const existingUsername = await User.findOne({ username: username.toLowerCase() });
      if (existingUsername) {
        return NextResponse.json({ 
          error: 'Username already exists' 
        }, { status: 400 });
      }
    }

    // Create user
    const userData: {
      email: string;
      name: string;
      password: string;
      role: 'admin' | 'employee' | 'client';
      username?: string;
    } = {
      email: email.toLowerCase(),
      name,
      password,
      role,
    };

    if (username && (role === 'admin' || role === 'employee')) {
      userData.username = username.toLowerCase();
    }

    const user = await User.create(userData);

    return NextResponse.json({ 
      message: 'User created successfully',
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

