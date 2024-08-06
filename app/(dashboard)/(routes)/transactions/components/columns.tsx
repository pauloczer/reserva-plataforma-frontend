"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

// Define o tipo de dado para as transações.
export type TransactionColumn = {
  id: string;
  serviceName: string;
  providerName: string;
  clientName: string;
  price: number;
}

export const columns: ColumnDef<TransactionColumn>[] = [
  {
    accessorKey: "serviceName",
    header: "Serviço",
  },
  {
    accessorKey: "providerName",
    header: "Prestador",
  },
  {
    accessorKey: "clientName",
    header: "Cliente",
  },
  {
    accessorKey: "price",
    header: "Preço",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
