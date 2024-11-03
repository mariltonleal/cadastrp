import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Cliente } from '../types';
import { ClienteForm } from '../components/ClienteForm';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteEdit, setClienteEdit] = useState<Cliente | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const db = getFirestore();
    const clientesRef = collection(db, 'clientes');
    const q = query(
      clientesRef,
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clientesData: Cliente[] = [];
      snapshot.forEach((doc) => {
        clientesData.push({ id: doc.id, ...doc.data() } as Cliente);
      });
      setClientes(clientesData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (data: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user) return;
    setLoading(true);

    try {
      const db = getFirestore();
      if (clienteEdit) {
        await updateDoc(doc(db, 'clientes', clienteEdit.id), {
          ...data,
          updatedAt: Date.now(),
        });
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await addDoc(collection(db, 'clientes'), {
          ...data,
          userId: user.id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        toast.success('Cliente cadastrado com sucesso!');
      }
      setShowForm(false);
      setClienteEdit(null);
    } catch (error) {
      toast.error('Erro ao salvar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cliente: Cliente) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'clientes', cliente.id));
      toast.success('Cliente excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir cliente');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {clienteEdit ? 'Editar Cliente' : 'Novo Cliente'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setClienteEdit(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ClienteForm
              cliente={clienteEdit || undefined}
              onSubmit={handleSubmit}
              isLoading={loading}
            />
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {clientes.map((cliente) => (
            <li key={cliente.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{cliente.nome}</h3>
                  <p className="text-sm text-gray-500">{cliente.email}</p>
                  <p className="text-sm text-gray-500">{cliente.telefone}</p>
                  <p className="text-sm text-gray-500">{cliente.endereco}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setClienteEdit(cliente);
                      setShowForm(true);
                    }}
                    className="p-2 text-indigo-600 hover:text-indigo-900"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cliente)}
                    className="p-2 text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {clientes.length === 0 && (
            <li className="px-6 py-4 text-center text-gray-500">
              Nenhum cliente cadastrado
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};