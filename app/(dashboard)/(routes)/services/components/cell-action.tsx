"use client";

import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react"; // Importa o hook useSession
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ServiceColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal } from "lucide-react";
import { AlertModalReserva } from "@/components/modals/alert-modal-reserva";

interface CellActionProps {
  data: ServiceColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { data: session } = useSession(); // Obtém a sessão do NextAuth
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(''); // Estado para armazenar a data da reserva

  const router = useRouter();
  const params = useParams();
  
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Id do serviço copiado com sucesso");
  };

  const handleReserve = async (date: string) => {
    try {
      const isoDate = new Date(date).toISOString(); // Converte a data para o formato ISO-8601
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.user?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: data.id,
          date: isoDate,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create reservation');
      }

      const result = await res.json();
      console.log('Reservation created:', result);
      toast.success('Reserva criada com sucesso!');
      setOpen(false);
      setDate('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao criar reserva';
      toast.error(errorMessage);
      console.error('Error creating reservation:', error);
    }
  };

  return (
    <>
      <AlertModalReserva
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={(selectedDate) => handleReserve(selectedDate)} // Passa a data selecionada para a função de reserva
        loading={loading}
        titulo={data.name} // Passa o nome do serviço para o título
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Reservar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
