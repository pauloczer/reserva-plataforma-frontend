import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from "jwt-decode"; // Certifique-se de importar corretamente sem as chaves

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await res.json();
          console.log("Response from /api/auth/login:", data);

          if (res.ok && data.token) {
            // Decodificar o token para extrair informações do usuário
            const decodedToken = jwtDecode(data.token) as { userId: string; role: string; email: string };
            //console.log("Decoded Token:", decodedToken);

            const user = {
              id: decodedToken.userId,
              role: decodedToken.role,
              email: decodedToken.email,
              token: data.token, // Incluindo o token aqui
            } as User & { token: string }; // Casting para o tipo User com token

            return user;
          }
        } catch (error) {
          console.error("Error in authorize function:", error);
        }
        return null;
      },
    }),
  ],
  pages: { signIn: '/' },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.token = user.token; // Incluindo o token no callback jwt
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          role: token.role as string,
          email: token.email as string,
          token: token.token as string, // Incluindo o token na sessão
        };
      }
      return session;
    },
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST, nextAuthOptions};
