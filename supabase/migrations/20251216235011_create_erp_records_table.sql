/*
  # Create ERP records table

  1. New Tables
    - `erp_records`
      - `id` (uuid, primary key) - Unique identifier
      - `record_number` (text) - Record number for display
      - `order_number` (text) - Related order number
      - `record_date` (date) - Date of the record
      - `record_type` (text) - Type of record (return, sale, etc.)
      - `status` (text) - Current status
      - `quantity` (integer) - Quantity of items
      - `amount` (decimal) - Total amount
      - `counterparty` (text) - Counterparty name
      - `marketplace` (text) - Marketplace name
      - `product_name` (text) - Product name
      - `category` (text) - Product category
      - `warehouse` (text) - Warehouse location
      - `manager` (text) - Responsible manager
      - `priority` (text) - Priority level
      - `description` (text) - Additional description
      - `payment_status` (text) - Payment status
      - `delivery_method` (text) - Delivery method
      - `is_urgent` (boolean) - Urgent flag
      - `is_processed` (boolean) - Processing flag
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `erp_records` table
    - Add policy for authenticated users to read all records
    - Add policy for authenticated users to insert records
    - Add policy for authenticated users to update records
    - Add policy for authenticated users to delete records
    
  3. Indexes
    - Add index on record_number for faster lookups
    - Add index on order_number for searching
    - Add index on record_date for date filtering
    - Add index on status for filtering
*/

CREATE TABLE IF NOT EXISTS erp_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  record_number text NOT NULL,
  order_number text,
  record_date date DEFAULT CURRENT_DATE,
  record_type text DEFAULT 'return',
  status text DEFAULT 'pending',
  quantity integer DEFAULT 0,
  amount decimal(12, 2) DEFAULT 0.00,
  counterparty text,
  marketplace text,
  product_name text,
  category text,
  warehouse text,
  manager text,
  priority text DEFAULT 'normal',
  description text,
  payment_status text DEFAULT 'unpaid',
  delivery_method text,
  is_urgent boolean DEFAULT false,
  is_processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_erp_records_record_number ON erp_records(record_number);
CREATE INDEX IF NOT EXISTS idx_erp_records_order_number ON erp_records(order_number);
CREATE INDEX IF NOT EXISTS idx_erp_records_date ON erp_records(record_date);
CREATE INDEX IF NOT EXISTS idx_erp_records_status ON erp_records(status);
CREATE INDEX IF NOT EXISTS idx_erp_records_marketplace ON erp_records(marketplace);

-- Enable Row Level Security
ALTER TABLE erp_records ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view all records"
  ON erp_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert records"
  ON erp_records FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update records"
  ON erp_records FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete records"
  ON erp_records FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_erp_records_updated_at
  BEFORE UPDATE ON erp_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();