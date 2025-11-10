import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendWelcomeEmail } from '@/lib/resend';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        isAdminLogin: { label: 'Is Admin Login', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.password) {
          throw new Error('Password required');
        }

        await connectDB();

        let user;
        
        // If admin login, use username. Otherwise, use email.
        if (credentials.isAdminLogin === 'true' && credentials.username) {
          user = await User.findOne({ username: credentials.username.toLowerCase() });
          if (!user) {
            throw new Error('No user found with this username');
          }
          // Verify user is admin or employee
          if (user.role === 'client') {
            throw new Error('Unauthorized access');
          }
        } else if (credentials.email) {
          user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error('No user found with this email');
          }
        } else {
          throw new Error('Email or username required');
        }

        const isValid = await user.comparePassword(credentials.password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        if (!user.isActive) {
          throw new Error('Account is deactivated');
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        return {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        await connectDB();

        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          // Existing user logging in with Google
          console.log('🔄 Existing user logged in with Google:', existingUser.email);
          
          // Update Google ID if not set
          if (!existingUser.googleId && account.providerAccountId) {
            existingUser.googleId = account.providerAccountId;
          }
          existingUser.lastLogin = new Date();
          if (profile && 'picture' in profile && typeof profile.picture === 'string') {
            existingUser.avatar = profile.picture;
          }
          await existingUser.save();
        } else {
          // Create new user with Google OAuth
          console.log('✨ Creating new user with Google OAuth:', user.email);
          
          const newUser = await User.create({
            email: user.email,
            name: user.name || 'User',
            googleId: account.providerAccountId,
            avatar: (profile && 'picture' in profile && typeof profile.picture === 'string') ? profile.picture : undefined,
            role: 'client', // Default role for new users
            lastLogin: new Date(),
          });

          // Send welcome email for new Google OAuth users
          try {
            await sendWelcomeEmail({
              userEmail: newUser.email,
              userName: newUser.name,
            });
            console.log('✅ Welcome email sent to new Google OAuth user:', newUser.email);
          } catch (emailError) {
            console.error('❌ Failed to send welcome email to Google OAuth user:', emailError);
            // Continue - account is still created
          }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      } else if (token.email) {
        // Refresh user data from DB
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = String(dbUser._id);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as 'admin' | 'employee' | 'client';
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

