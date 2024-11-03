import { supabase } from '../lib/supabase';
import { Cliente } from '../types';
import { Tables } from '../lib/supabase';

export const createCliente = async (cliente: Omit<Cliente, 'id'>) => {
  const { data, error } = await supabase
    .from('clientes')
    .insert([{
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
      user_id: cliente.userId,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCliente = async (id: string, data: Partial<Cliente>) => {
  const { error } = await supabase
    .from('clientes')
    .update({
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      endereco: data.endereco,
    })
    .eq('id', id);

  if (error) throw error;
};

export const deleteCliente = async (id: string) => {
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const subscribeToClientes = (userId: string, callback: (clientes: Cliente[]) => void) => {
  const channel = supabase
    .channel('clientes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'clientes',
      filter: `user_id=eq.${userId}`,
    }, () => {
      getClientes(userId).then(callback);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const getClientes = async (userId: string) => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Cliente[];
};