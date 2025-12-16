import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ERPRecord {
  id: string;
  record_number: string;
  order_number: string | null;
  record_date: string;
  record_type: string;
  status: string;
  quantity: number;
  amount: number;
  counterparty: string | null;
  marketplace: string | null;
  product_name: string | null;
  category: string | null;
  warehouse: string | null;
  manager: string | null;
  priority: string;
  description: string | null;
  payment_status: string;
  delivery_method: string | null;
  is_urgent: boolean;
  is_processed: boolean;
  created_at: string;
  updated_at: string;
}
