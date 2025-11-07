import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Link from 'next/link';
import Image from 'next/image';
import ProductActions from '@/components/admin/ProductActions';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  await getServerSession(authOptions);
  await connectDB();

  // Fetch all products
  const productsRaw = await Product.find()
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
    .sort({ createdAt: -1 })
    .lean();

  // Type-safe products
  const products = productsRaw as unknown as Array<{
    _id: unknown;
    sku: string;
    name: { en: string; es: string };
    category: string;
    stock: number;
    status: string;
    images: string[];
    createdBy?: { name: string } | null;
    updatedBy?: { name: string } | null;
    updatedAt: Date;
  }>;

  // Filter by status
  const activeProducts = products.filter((p) => p.status === 'active');
  const hiddenProducts = products.filter((p) => p.status === 'hidden');
  const discontinuedProducts = products.filter((p) => p.status === 'discontinued');

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
          <p className="text-gray-400">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Total Products</p>
          <p className="text-3xl font-bold text-white">{products.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Active</p>
          <p className="text-3xl font-bold text-green-500">{activeProducts.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Hidden</p>
          <p className="text-3xl font-bold text-yellow-500">{hiddenProducts.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Discontinued</p>
          <p className="text-3xl font-bold text-red-500">{discontinuedProducts.length}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by SKU, name, or category..."
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
            />
          </div>
          <select className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
            <option value="discontinued">Discontinued</option>
          </select>
          <button className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-white">All Products</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm">
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden xl:table-cell">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    No products yet. Click &quot;Add Product&quot; to create your first product.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={String(product._id)} className="hover:bg-zinc-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name.en}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded bg-zinc-700 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No img</span>
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{product.name.en}</div>
                          <div className="text-xs text-gray-400">{product.name.es}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300 font-mono">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-300">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-gray-300">
                        {product.stock > 0 ? (
                          <span className="text-green-500">{product.stock}</span>
                        ) : (
                          <span className="text-red-500">Out of stock</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === 'active'
                            ? 'bg-green-500/10 text-green-500'
                            : product.status === 'hidden'
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden xl:table-cell">
                      <div>{new Date(product.updatedAt).toLocaleDateString()}</div>
                      {product.updatedBy && (
                        <div className="text-xs text-gray-500">by {product.updatedBy.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <ProductActions productId={String(product._id)} status={product.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

