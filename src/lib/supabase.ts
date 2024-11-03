import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bjhjdrzcaufvhoscobyk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqaGpkcnpjYXVmdmhvc2NvYnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2NTEyOTksImV4cCI6MjA0NjIyNzI5OX0.yVXTEjYHNDQrwV6dQd05alSJRZYCa9_AX3BnYyoskeU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Tables = {
  clientes: {
    Row: {
      id: string;
      created_at: string;
      nome: string;
      email: string;
      telefone: string;
      endereco: string;
      user_id: string;
    };
    Insert: Omit<Tables['clientes']['Row'], 'id' | 'created_at'>;
    Update: Partial<Tables['clientes']['Insert']>;
  };
};