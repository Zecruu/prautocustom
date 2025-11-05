import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { ProductsPageClient } from '@/components/ProductsPageClient';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Settings, { ISettings } from '@/models/Settings';

export const dynamic = 'force-dynamic';

// SEO Metadata for Products Page
export const metadata: Metadata = {
  title: 'Premium Custom Rims & Wheels - Shop Online',
  description: 'Browse our extensive collection of premium custom rims, wheels, tires, and accessories for your vehicle. Free quotes, expert installation, and shipping to all Puerto Rico. Brands include BMF, 4Play, and more.',
  keywords: [
    'buy custom rims Puerto Rico',
    'shop wheels online PR',
    'custom rims for sale',
    'premium wheels Carolina',
    'rims catalog Puerto Rico',
    'aftermarket wheels',
    'car rims shop',
    'truck wheels',
    'SUV rims',
    'Jeep wheels Puerto Rico',
    'BMF wheels',
    '4Play rims',
    'custom wheel packages',
  ],
  openGraph: {
    title: 'Premium Custom Rims & Wheels - Shop Our Catalog',
    description: 'Browse premium custom rims, wheels, and accessories. Expert installation in Carolina, Puerto Rico.',
    type: 'website',
    images: [
      {
        url: '/images/porsche-macan-custom-wheels-pr-auto.jpg',
        width: 1200,
        height: 630,
        alt: 'Custom Wheels Catalog - PR Auto Custom',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Custom Rims & Wheels - Shop Online',
    description: 'Browse our extensive collection of premium custom rims and wheels for your vehicle.',
  },
  alternates: {
    canonical: '/products',
  },
};

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

  // Structured data for product catalog page
  const catalogSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://www.prautocustoms.com/products",
    "name": "Custom Rims & Wheels Catalog",
    "description": "Browse our extensive collection of premium custom rims, wheels, and automotive accessories in Puerto Rico.",
    "url": "https://www.prautocustoms.com/products",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://www.prautocustoms.com/#website",
      "url": "https://www.prautocustoms.com",
      "name": "PR Auto Custom"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.prautocustoms.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Products",
          "item": "https://www.prautocustoms.com/products"
        }
      ]
    }
  };

  return (
    <main className="w-full bg-black min-h-screen">
      {/* Structured Data for Products Catalog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }}
      />
      
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

