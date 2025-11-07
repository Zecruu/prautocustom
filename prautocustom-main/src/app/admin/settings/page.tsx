import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Settings, { ISettings } from '@/models/Settings';
import { SettingsClient } from '@/components/admin/SettingsClient';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  // Only admins can access this page
  if (!session || session.user.role !== 'admin') {
    redirect('/admin/dashboard');
  }

  await connectDB();

  // Fetch settings
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

  return (
    <div className="p-4 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage vehicle types and product categories for filtering</p>
      </div>

      <SettingsClient
        initialVehicleTypes={settings?.vehicleTypes || []}
        initialProductCategories={settings?.productCategories || []}
      />
    </div>
  );
}

