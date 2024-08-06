"use client";

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from "react-hot-toast";
import { Spinner } from '@/components/spinner';
import Link from 'next/link'; // Importa o componente Link

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Ativa o carregamento

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false); // Desativa o carregamento

    if (result?.ok) {
      toast.success('Login bem-sucedido!'); 
      router.push('/dashboard');
    } else {
      toast.error('Erro de autenticação. Verifique suas credenciais.'); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              aria-label="Email"
            />
          </div>
          <div className="mb-6">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
              aria-label="Password"
            />
          </div>
          <Button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300 ease-in-out ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? <Spinner className="w-5 h-5 text-white animate-spin" /> : 'Login'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/register" className="text-blue-600 hover:underline">
            Não tem uma conta? Registre-se
          </Link>
        </div>
      </Card>
    </div>
  );
}
