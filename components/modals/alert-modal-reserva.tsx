"use client";

import { useEffect, useState } from "react";
import Modal from "../ui/modal";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ptBR } from "date-fns/locale"; // Importa a localização em português

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";

interface AlertModalReservaProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void; // Adicione a data como argumento para a confirmação
  loading: boolean;
  titulo: string;
}

export const AlertModalReserva: React.FC<AlertModalReservaProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  titulo,
}) => {
  const [date, setDate] = React.useState<Date | undefined>(undefined); // Inicialize com undefined
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleConfirm = () => {
    if (date) {
      const isoDate = date.toISOString(); // Converte a data para o formato ISO-8601
      onConfirm(isoDate); // Passa a data no formato ISO-8601 para a função de confirmação
    }
  };

  return (
    <Modal
      title={`${titulo}`}
      description="Regista uma reserva"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[250px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolher uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button disabled={loading} className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleConfirm}>
  Continuar
</Button>
      </div>
    </Modal>
  );
};
