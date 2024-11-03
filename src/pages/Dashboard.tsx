import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { ClienteForm } from '../components/ClienteForm';
import { Cliente } from '../types';
import { createCliente, updateCliente, deleteCliente, getClientes } from '../services/clienteService';
import { toast } from 'react-hot-toast';
import { LogOut, Edit, Trash2, Plus, X, Loader2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadClientes = async () => {
      try {
        const data = await getClientes(user.id);
        setClientes(data);
      } catch (error) {
        toast.error('Erro ao carregar clientes');
      } finally {
        setLoading(false);
      }
    };

    loadClientes();
  }, [user]);

  const handleCreateCliente = async (data: Omit<Cliente, 'id' | 'userId' | 'createdAt'>) => {
    try {
      await createCliente({
        ...data,
        userId: user!.id,
        createdAt: new Date().toISOString(),
      });
      setShowForm(false);
      toast.success('Cliente cadastrado com sucesso!');
      // Recarrega a lista
      const updatedClientes = await getClientes(user!.id);
      setClientes(updatedClientes);
    } catch (error) {
      toast.error('Erro ao cadastrar cliente.');
    }
  };

  const handleUpdateCliente = async (data: Omit<Cliente, 'id' | 'userId' | 'createdAt'>) => {
    try {
      if (!editingCliente?.id) return;
      await updateCliente(editingCliente.id, data);
      setEditingCliente(null);
      setShowForm(false);
      toast.success('Cliente atualizado com sucesso!');
      // Recarrega a lista
      const updatedClientes = await getClientes(user!.id);
      setClientes(updatedClientes);
    } catch (error) {
      toast.error('Erro ao atualizar cliente.');
    }
  };

  const handleDeleteCliente = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      await deleteCliente(id);
      toast.success('Cliente removido com sucesso!');
      // Atualiza a lista localmente
      setClientes(clientes.filter(cliente => cliente.id !== id));
    } catch (error) {
      toast.error('Erro ao remover cliente.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema de Cadastro de Clientes
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </button>
          </div>

          {clientes.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
              Nenhum cliente cadastrado. Clique em "Novo Cliente" para começar.
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Endereço
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cliente.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cliente.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cliente.telefone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cliente.endereco}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditingCliente(cliente);
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCliente(cliente.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingCliente(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ClienteForm
                onSubmit={editingCliente ? handleUpdateCliente : handleCreateCliente}
                initialData={editingCliente}
                buttonText={editingCliente ? 'Atualizar' : 'Cadastrar'}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};