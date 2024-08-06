'use client'

import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { APiAlert } from "./api-alert";

interface ApiListProps {
    nameIndicated: string;
    idIndicated: string;
}

export const ApiList: React.FC<ApiListProps> = ({
    nameIndicated,
    idIndicated
}) => {

    const params = useParams();
    const origin = useOrigin();

    const baseUrl = `${origin}/api/${params.storeId}`

    return (
        <>
        <APiAlert 
          title="OBTER " 
          variant="public"
          description={`${baseUrl}/${nameIndicated}`}
        />
        <APiAlert 
          title="OBTER " 
          variant="public"
          description={`${baseUrl}/${nameIndicated}/${idIndicated}`}
        />
        <APiAlert 
          title="CRIAR " 
          variant="admin"
          description={`${baseUrl}/${nameIndicated}`}
        />
        <APiAlert 
          title="ATUALIZAR " 
          variant="admin"
          description={`${baseUrl}/${nameIndicated}/${idIndicated}`}
        />
        <APiAlert 
          title="REMOVER " 
          variant="admin"
          description={`${baseUrl}/${nameIndicated}/${idIndicated}`}
        />
      </>
    )
}