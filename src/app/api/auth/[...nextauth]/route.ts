import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

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
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found with this email');
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
          await User.create({
            email: user.email,
            name: user.name || 'User',
            googleId: account.providerAccountId,
            avatar: (profile && 'picture' in profile && typeof profile.picture === 'string') ? profile.picture : undefined,
            role: 'client', // Default role for new users
            lastLogin: new Date(),
          });
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

