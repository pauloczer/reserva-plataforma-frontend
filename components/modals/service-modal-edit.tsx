import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Modal from "../ui/modal";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

const formSchema = z.object({
    name: z.string().min(1, { message: "O nome é obrigatório" }),
    description: z.string().min(1, { message: "A descrição é obrigatória" }),
    price: z.string().min(1, { message: "O preço é obrigatório" })
});

interface ServiceEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceId?: string; // ID do serviço para edição
}

export const ServiceEditModal = ({ isOpen, onClose, serviceId }: ServiceEditModalProps) => {
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: ""
        }
    });

    // Carregar dados do serviço para edição
    useEffect(() => {
        if (serviceId) {
            const fetchService = async () => {
                try {
                  //console.log(`Fetching service with ID: ${serviceId}`);
                  //console.log(`Authorization token: ${session?.user?.token}`);
                  
                  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${serviceId}`, {
                    headers: {
                      'Authorization': `Bearer ${session?.user?.token}`,
                    },
                  });
              
                  if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
              
                  const data = await response.json();
                  //console.log('Service data:', data);
              
                  form.reset({
                    name: data.name,
                    description: data.description,
                    price: data.price.toString(), // Converter para string
                  });
                } catch (error) {
                  toast.error("Erro ao carregar dados do serviço");
                  //console.error('Error details:', error);
                }
              };
            fetchService();
        }
    }, [serviceId, session?.user?.token, form]); // Inclui form no array de dependências

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            // Convertendo o preço para número
            const payload = {
                ...values,
                price: parseFloat(values.price),
                providerId: session?.user?.id // Inclua o providerId
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${serviceId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session?.user?.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            //console.log(data);
            toast.success("Serviço atualizado com sucesso");
            window.location.assign('/manage-services');
        } catch (error) {
            toast.error("Erro ao atualizar serviço");
            //console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            title="Editar Serviço"
            description="Atualize os dados do serviço"
            isOpen={isOpen}
            onClose={onClose}
        >
            <div>
                <div className='space-y-4 py-2 pb-4'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Digite nome do Serviço'
                                                {...field}
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Digite a descrição do Serviço'
                                                {...field}
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='price'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Preço</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                placeholder='Digite o preço do Serviço'
                                                {...field}
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                                <Button disabled={loading} variant="outline" onClick={onClose}>Cancelar</Button>
                                <Button disabled={loading} type='submit'>Salvar</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
}
