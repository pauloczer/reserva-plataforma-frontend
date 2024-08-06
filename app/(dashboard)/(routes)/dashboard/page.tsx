'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Loader from '@/components/loading';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [serviceCount, setServiceCount] = useState<number>(0);
  const [reservationCount, setReservationCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    if (!session?.user?.token) {
      console.error('Token de autenticação não encontrado.');
      return;
    }

    try {
      
     
      // Requisição para obter o número de reservas do usuário
      const reservationRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/count`, {
        headers: {
          'Authorization': `Bearer ${session.user.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!reservationRes.ok) {
        throw new Error('Erro na resposta da API de reservas');
      }
      const reservationData = await reservationRes.json();
      setReservationCount(reservationData.count);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.token]);

  useEffect(() => {
    if (status === 'loading') {
      // Exibe o carregador enquanto a sessão está carregando
      setLoading(true);
      return;
    }

    if (!session) {
      router.push('/');
    } else {
      // Mensagem de depuração se a sessão estiver disponível
      console.log('Session found:', session);
      fetchData();
    }
  }, [session, status, router, fetchData]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Reservas</h2>
          <p className="text-3xl font-bold text-green-600">{reservationCount}</p>
          <Link href="/transactions" className="text-blue-500 hover:underline mt-4 inline-block">
            Ver histórico de reservas
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
