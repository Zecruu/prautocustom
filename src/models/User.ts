import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  username?: string; // For admin/employee login
  role: 'admin' | 'employee' | 'client';
  googleId?: string;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: function(this: IUser) {
        // Password required only if not using Google OAuth
        return !this.googleId;
      },
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values (for clients)
      trim: true,
      lowercase: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['admin', 'employee', 'client'],
      default: 'client',
      required: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    avatar: {
      type: String,
    },
    phone: {
      type: String,
      trim: true,
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
      select: false, // Don't include in queries by default
    },
    resetPasswordExpires: {
      type: Date,
      select: false, // Don't include in queries by default
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Prevent password from being returned in queries
UserSchema.set('toJSON', {
  transform: function(_doc, ret) {
    delete ret.password;
    return ret;
  },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

