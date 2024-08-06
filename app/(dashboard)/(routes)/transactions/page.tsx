'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { TransactionClient } from './components/client';
import { TransactionColumn } from './components/columns';
import Loader from '@/components/loading';


type ApiTransaction = {
  id: number;
  service: {
    name: string;
    provider: {
      name: string;
    };
    price: number;
  };
  user: {
    name: string;
  };
};

const TransactionsPage = () => {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<TransactionColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations`, {
          headers: {
            'Authorization': `Bearer ${session?.user?.token}`,
            'Content-Type': 'application/json',
          },
        });

        const formattedData = response.data.map((transaction: ApiTransaction) => ({
          id: transaction.id.toString(),
          serviceName: transaction.service.name,
          providerName: transaction.service.provider.name,
          clientName: transaction.user.name,
          price: transaction.service.price,
        }));

        setTransactions(formattedData);
      } catch (error) {
        setError('Erro ao carregar as transações');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.token) {
      fetchTransactions();
    } else {
      //setError('Usuário não autenticado');
      setLoading(false);
    }
  }, [session]);

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TransactionClient data={transactions} />
      </div>
    </div>
  );
};

export default TransactionsPage;
