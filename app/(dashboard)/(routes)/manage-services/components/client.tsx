"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heanding";
import { Separator } from "@/components/ui/separator";
import { DataTableCreate } from "@/components/ui/data-table-criar";
import { ServiceColumn, columns } from "./columns";

interface TransactionClientProps {
  data: ServiceColumn[];
}

export const TransactionClient: React.FC<TransactionClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={"Serviços Disponíveis"} description="Veja os nossos serviços e preços" />
      </div>
      <Separator />
      
      <DataTableCreate data={data} columns={columns} searchKey="name" />
      
      <Separator />
    </>
  );
};
