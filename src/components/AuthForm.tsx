import React, { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';

interface Props {
  onSubmit: (email: string, password: string) => void;
  isRegister?: boolean;
}

export const AuthForm: React.FC<Props> = ({ onSubmit, isRegister = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Senha</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isRegister ? (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            Criar Conta
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4 mr-2" />
            Entrar
          </>
        )}
      </button>
    </form>
  );
};