import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH - Update user (Admin only)
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can update users
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { username, password, name, role, isActive } = body;

    await connectDB();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update fields if provided
    if (username !== undefined) {
      // Check if username already exists (exclude current user)
      if (username) {
        const existingUsername = await User.findOne({ 
          username: username.toLowerCase(),
          _id: { $ne: id }
        });
        if (existingUsername) {
          return NextResponse.json({ 
            error: 'Username already exists' 
          }, { status: 400 });
        }
        user.username = username.toLowerCase();
      } else {
        user.username = undefined;
      }
    }

    if (password !== undefined) {
      if (password.length < 6) {
        return NextResponse.json({ 
          error: 'Password must be at least 6 characters' 
        }, { status: 400 });
      }
      user.password = password; // Will be hashed by pre-save hook
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (role !== undefined) {
      if (!['admin', 'employee', 'client'].includes(role)) {
        return NextResponse.json({ 
          error: 'Invalid role' 
        }, { status: 400 });
      }
      user.role = role;
    }

    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    await user.save();

    return NextResponse.json({ 
      message: 'User updated successfully',
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
      }
    });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE - Delete user (Admin only)
export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can delete users
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 });
    }

    const { id } = await context.params;

    // Prevent admin from deleting themselves
    if (id === session.user.id) {
      return NextResponse.json({ 
        error: 'Cannot delete your own account' 
      }, { status: 400 });
    }

    await connectDB();

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'User deleted successfully',
      deletedId: id 
    });
  } catch (error) {
    console.error('User deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

