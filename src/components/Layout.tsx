import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8" />
              <span className="text-xl font-semibold">Sistema de Clientes</span>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <span>{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-indigo-700 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};