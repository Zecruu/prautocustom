import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

// GET - Fetch settings
export async function GET() {
  try {
    await connectDB();

    let settings = await Settings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({
        vehicleTypes: [
          { name: 'Jeep', slug: 'jeep', active: true },
          { name: 'Truck', slug: 'truck', active: true },
          { name: 'SUV', slug: 'suv', active: true },
          { name: 'Car', slug: 'car', active: true },
        ],
        productCategories: [
          { name: 'Rims', slug: 'rims', active: true },
          { name: 'Tires', slug: 'tires', active: true },
          { name: 'Lights', slug: 'lights', active: true },
          { name: 'Bumpers', slug: 'bumpers', active: true },
          { name: 'Lift Kits', slug: 'lift-kits', active: true },
        ],
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { vehicleTypes, productCategories } = body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({
        vehicleTypes: vehicleTypes || [],
        productCategories: productCategories || [],
        updatedBy: session.user.id,
      });
    } else {
      if (vehicleTypes) settings.vehicleTypes = vehicleTypes;
      if (productCategories) settings.productCategories = productCategories;
      settings.updatedBy = session.user.id as unknown as mongoose.Types.ObjectId;
    }

    await settings.save();

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

