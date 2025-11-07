import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicleType {
  _id?: string;
  name: string;
  slug: string;
  icon?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductCategory {
  _id?: string;
  name: string;
  slug: string;
  icon?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISubFilter {
  _id?: string;
  name: string;
  slug: string;
  options: string[]; // Array of options for this sub-filter (e.g., ["5 hole", "6 hole", "8 hole"])
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISettings extends Document {
  vehicleTypes: IVehicleType[];
  productCategories: IProductCategory[];
  subFilters: ISubFilter[];
  updatedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const VehicleTypeSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  icon: { type: String },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const ProductCategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  icon: { type: String },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const SubFilterSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  options: [{ type: String }], // Array of options
  active: { type: Boolean, default: true },
}, { timestamps: true });

const SettingsSchema = new Schema({
  vehicleTypes: [VehicleTypeSchema],
  productCategories: [ProductCategorySchema],
  subFilters: [SubFilterSchema],
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Ensure only one settings document exists
SettingsSchema.index({}, { unique: true });

const Settings = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;

