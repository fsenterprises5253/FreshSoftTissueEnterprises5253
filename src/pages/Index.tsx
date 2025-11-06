import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Wrench } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import PartsTable from "@/components/PartsTable";
import AddPartDialog from "@/components/AddPartDialog";

interface SparePart {
  id: string;
  part_number: string;
  part_name: string;
  category: string;
  manufacturer: string | null;
  description: string | null;
  price: number;
  cost_price: number | null;
  stock_quantity: number;
  minimum_stock: number;
  unit: string;
  location: string | null;
}

const Index = () => {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParts = async () => {
    try {
      const { data, error } = await supabase
        .from("spare_parts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setParts(data || []);
    } catch (error) {
      console.error("Error fetching parts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const totalParts = parts.length;
  const totalValue = parts.reduce((sum, part) => sum + part.price * part.stock_quantity, 0);
  const lowStockCount = parts.filter((part) => part.stock_quantity <= part.minimum_stock).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary to-accent">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AutoParts Inventory
                </h1>
                <p className="text-sm text-muted-foreground">
                  Automotive Spare Parts Management System
                </p>
              </div>
            </div>
            <AddPartDialog onPartAdded={fetchParts} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="h-12 w-12 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <p className="text-muted-foreground">Loading inventory data...</p>
            </div>
          </div>
        ) : (
          <>
            <Dashboard
              totalParts={totalParts}
              totalValue={totalValue}
              lowStockCount={lowStockCount}
            />
            <div>
              <h2 className="text-xl font-semibold mb-4">All Spare Parts</h2>
              <PartsTable parts={parts} onUpdate={fetchParts} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;