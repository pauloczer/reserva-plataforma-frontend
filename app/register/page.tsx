"use client";

import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  nif: z.string()
    .length(14, { message: "O NIF deve ter 14 caracteres" })
    .regex(/^\d{9}[A-Za-z]{2}\d{3}$/, { message: "Formato do NIF inválido" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  role: z.enum(['Client', 'Prestador de Serviço'], { message: "Tipo de Utilizador inválido" }),
  balance: z.string().regex(/^[0-9]+$/, { message: "O saldo deve ser um número positivo" }).transform(value => parseFloat(value)),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterUser() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      nif: '',
      email: '',
      password: '',
      role: 'Client',
      balance: 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    //console.log(values);
    try {
      setLoading(true);

      // Convertendo o saldo para número
      const payload = {
        ...values,
        balance: Number(values.balance), // Garante que balance é um número
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, payload);
      toast.success("Utilizador registrado com sucesso!");
      form.reset();
      router.push('/');
    } catch (error) {
      toast.error("Erro ao registrar Utilizador.");
      //console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Registrar Usuário</h1>
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
                      placeholder='Digite o nome completo'
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
              name='nif'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIF</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Digite o NIF'
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
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='Digite o email'
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
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Digite a senha'
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
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Utilizador</FormLabel>
                  <FormControl>
                    <select {...field} disabled={loading} className="w-full border border-gray-300 rounded-md p-2">
                      <option value="Client">Client</option>
                      <option value="Prestador de Serviço">Prestador de Serviço</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='balance'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saldo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Digite o saldo'
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
              <Button disabled={loading} variant="outline">Cancelar</Button>
              <Button disabled={loading} type='submit'>Registrar</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
