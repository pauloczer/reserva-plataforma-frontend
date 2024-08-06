'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname() || ''; // Garante que pathname seja uma string
  const { data: session } = useSession();
  const userRole = session?.user?.role || ''; // Garante que role seja uma string

  const routes = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      active: pathname === '/dashboard',
      roles: ['Client', 'Prestador de Serviço'] // Visível para todos os usuários
    },
    {
      href: '/services',
      label: 'Serviços',
      active: pathname === '/services',
      roles: ['Client'] // Visível apenas para clientes
    },
    {
      href: '/transactions',
      label: 'Reservas',
      active: pathname === '/transactions',
      roles: ['Client'] // Visível apenas para clientes
    },
    {
      href: '/manage-services',
      label: 'Gerenciar Serviços',
      active: pathname === '/manage-services',
      roles: ['Prestador de Serviço'] // Visível apenas para prestadores de serviço
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes
        .filter(route => route.roles.includes(userRole))
        .map(route => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              route.active ? "text-black dark:text-white" : "text-muted-foreground"
            )}
          >
            {route.label}
          </Link>
        ))}
    </nav>
  );
}
