"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

// Define o tipo de dado para as transações.
export type ServiceColumn  = {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const columns: ColumnDef<ServiceColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: info => `${info.getValue()} AOA`
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
