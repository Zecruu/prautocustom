import { Navbar } from '@/components/Navbar';
import { ProductsPageClient } from '@/components/ProductsPageClient';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Settings, { ISettings } from '@/models/Settings';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  await connectDB();

  // Fetch active products
  const productsRaw = await Product.find({ status: 'active' })
    .sort({ createdAt: -1 })
    .lean();

  // Fetch settings for filters
  let settings = await Settings.findOne().lean() as ISettings | null;

  // Create default settings if none exist
  if (!settings) {
    await Settings.create({
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
    settings = await Settings.findOne().lean() as ISettings | null;
  }

  // Convert to plain objects
  const products = JSON.parse(JSON.stringify(productsRaw));
  const vehicleTypes = settings?.vehicleTypes.filter((vt: { active: boolean }) => vt.active) || [];
  const productCategories = settings?.productCategories.filter((pc: { active: boolean }) => pc.active) || [];

  return (
    <main className="w-full bg-black min-h-screen">
      <Navbar />
      <div className="pt-20">
        <ProductsPageClient
          products={products}
          vehicleTypes={vehicleTypes}
          productCategories={productCategories}
        />
      </div>
    </main>
  );
}

