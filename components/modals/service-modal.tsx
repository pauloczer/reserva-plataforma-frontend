import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { useStoreModal } from "@/hooks/use-store-modal";
import Modal from "../ui/modal";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const formSchema = z.object({
    name: z.string().min(1, { message: "O nome é obrigatório" }),
    description: z.string().min(1, { message: "A descrição é obrigatória" }),
    price: z.string().min(1, { message: "O preço é obrigatório" })
});

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ServiceModal = ({ isOpen, onClose }: ServiceModalProps) => {
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: ""
        }
    });

    const { data: session } = useSession(); // Assumindo que você já está usando o NextAuth

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            // Convertendo o preço para número
            const payload = {
                ...values,
                price: parseFloat(values.price), // Converte o preço para número
                providerId: session?.user?.id // Inclua o providerId
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${session?.user?.token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json(); // Corrigido: lê a resposta JSON
            //console.log(data);
            toast.success("Serviço criado com sucesso");
            window.location.assign('/manage-services');
        } catch (error) {
            toast.error("Erro ao criar serviço");
            //console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            title="Serviço"
            description="Cria os serviços"
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
                                <Button disabled={loading} type='submit'>Criar</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}
