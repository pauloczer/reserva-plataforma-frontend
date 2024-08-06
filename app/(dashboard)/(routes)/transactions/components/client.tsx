"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heanding";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { TransactionColumn, columns } from "./columns";

interface TransactionClientProps {
  data: TransactionColumn[];
}

export const TransactionClient: React.FC<TransactionClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={"Histórico de Transações"} description="Veja todas transações feitas" />
      </div>
      <Separator />
      <DataTable data={data} columns={columns} searchKey="serviceName" />
      <Separator />
    </>
  );
};
