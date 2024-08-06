'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import { TransactionClient } from './components/client';
import { ServiceColumn } from './components/columns';
import Loader from '@/components/loading';
 // Ajuste o caminho conforme necessário

type ApiService = {
  id: number;
  name: string;
  description: string;
  price: number;
  provider: {
    name: string;
  };
};

export default function ManageServices() {
  const { data: session } = useSession();
  const [services, setServices] = useState<ServiceColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
       
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, {
          headers: {
            'Authorization': `Bearer ${session?.user?.token}`,
            'Content-Type': 'application/json',
          },
        });

        const formattedData = response.data.map((service: ApiService) => ({
          id: service.id.toString(),
          name: service.name,
          description: service.description,
          price: service.price,
        }));

        setServices(formattedData);
      } catch (error) {
        console.log(error)
        //setError('Erro ao carregar os serviços');
        signOut();
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.token) {
      fetchServices();
    } else {
      //setError('Usuário não autenticado');
      setLoading(false);
    }
  }, [session]);

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-8">
      <TransactionClient data={services} />
    </div>
  );
}
