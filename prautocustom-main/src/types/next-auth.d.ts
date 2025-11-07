import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: 'admin' | 'employee' | 'client';
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: 'admin' | 'employee' | 'client';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'admin' | 'employee' | 'client';
  }
}

