/**
 * Script to create the first admin user
 * Run with: npx tsx scripts/create-admin.ts
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI environment variable is not set!');
  console.log('\nPlease set MONGODB_URI in your .env.local file or as an environment variable.\n');
  process.exit(1);
}

// User Schema (inline for script)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee', 'client'], default: 'client' },
  googleId: { type: String },
  avatar: { type: String },
  phone: { type: String },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  try {
    console.log('🚀 PR Auto Custom - Admin User Creation\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!); // Non-null assertion: we've already checked and exited if undefined
    console.log('✅ Connected to MongoDB\n');

    // Get admin details
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 characters): ');
    const phone = await question('Enter admin phone (optional): ');

    // Validate input
    if (!name || !email || !password) {
      console.error('❌ Name, email, and password are required!');
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters!');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('❌ User with this email already exists!');
      process.exit(1);
    }

    // Hash password
    console.log('\n🔐 Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      phone: phone || undefined,
      isActive: true,
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('\n📋 Admin Details:');
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin._id}`);
    console.log('\n🎉 You can now sign in at: http://localhost:3000/admin/signin\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    rl.close();
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

createAdmin();

