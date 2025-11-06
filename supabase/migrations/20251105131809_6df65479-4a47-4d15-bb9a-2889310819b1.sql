-- Create spare parts table
CREATE TABLE public.spare_parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  part_number TEXT NOT NULL UNIQUE,
  part_name TEXT NOT NULL,
  category TEXT NOT NULL,
  manufacturer TEXT,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  cost_price DECIMAL(10, 2),
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  minimum_stock INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'piece',
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.spare_parts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Anyone can view spare parts"
ON public.spare_parts
FOR SELECT
USING (true);

-- Create policy to allow public insert
CREATE POLICY "Anyone can insert spare parts"
ON public.spare_parts
FOR INSERT
WITH CHECK (true);

-- Create policy to allow public update
CREATE POLICY "Anyone can update spare parts"
ON public.spare_parts
FOR UPDATE
USING (true);

-- Create policy to allow public delete
CREATE POLICY "Anyone can delete spare parts"
ON public.spare_parts
FOR DELETE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_spare_parts_updated_at
BEFORE UPDATE ON public.spare_parts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster searches
CREATE INDEX idx_spare_parts_part_number ON public.spare_parts(part_number);
CREATE INDEX idx_spare_parts_category ON public.spare_parts(category);
CREATE INDEX idx_spare_parts_part_name ON public.spare_parts(part_name);