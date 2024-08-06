// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();

  // Verifica se o caminho é para recursos estáticos (CSS, fontes, JavaScript, etc.)
  if (req.nextUrl.pathname.startsWith('/_next/') || req.nextUrl.pathname.startsWith('/static/')) {
    return NextResponse.next();
  }

  // Se o usuário não estiver autenticado e não estiver na página de login
  if (!token) {
    if (req.nextUrl.pathname !== '/') {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  } else {
    // Se o usuário estiver autenticado e tentar acessar a página de login
    if (req.nextUrl.pathname === '/') {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
