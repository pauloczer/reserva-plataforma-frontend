// src/types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    role: string;
    token: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      token: string;
    };
  }

  interface JWT {
    id?: string;
    email: string;
    role?: string;
    token: string;
  }
}
