import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  sku: string;
  name: {
    en: string;
    es: string;
  };
  category: string;
  vehicleTypes?: string[]; // Array of vehicle type slugs (e.g., ['jeep', 'truck'])
  description?: {
    en?: string;
    es?: string;
  };
  price?: number;
  images: string[]; // S3/Cloudflare URLs
  specifications?: Record<string, string>;
  stock: number;
  status: 'active' | 'hidden' | 'discontinued';
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      en: {
        type: String,
        required: true,
        trim: true,
      },
      es: {
        type: String,
        required: true,
        trim: true,
      },
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    vehicleTypes: {
      type: [String],
      default: [],
      index: true,
    },
    description: {
      en: {
        type: String,
        trim: true,
      },
      es: {
        type: String,
        trim: true,
      },
    },
    price: {
      type: Number,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    specifications: {
      type: Map,
      of: String,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'hidden', 'discontinued'],
      default: 'active',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search
ProductSchema.index({ 'name.en': 'text', 'name.es': 'text', category: 'text' });
ProductSchema.index({ category: 1, vehicleTypes: 1 });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

