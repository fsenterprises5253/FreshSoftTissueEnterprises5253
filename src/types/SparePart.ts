export interface SparePart {
  id: number;
  gsm_number: number;
  category: string;
  description?: string;
  manufacturer?: string | null;

  stock: number;
  cost_price: number;
  selling_price: number;

  kg?: number | null;
  amount?: number | null;

  minimum_stock: number;  // REQUIRED
  unit: string;   
}
