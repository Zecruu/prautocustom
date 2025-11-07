import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'employee')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { sku, name, description, category, vehicleTypes, subFilters, images, stock, status } = data;

    // Validate required fields
    if (!sku || !name?.en || !category) {
      return NextResponse.json(
        { error: 'SKU, English name, and category are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this SKU already exists' },
        { status: 400 }
      );
    }

    // Create product
    const product = await Product.create({
      sku,
      name,
      description,
      category,
      vehicleTypes: vehicleTypes || [],
      subFilters: subFilters || {},
      images: images || [],
      stock: stock || 0,
      status: status || 'active',
      createdBy: session.user.id,
      updatedBy: session.user.id,
    });

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product: {
          id: String(product._id),
          sku: product.sku,
          name: product.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

