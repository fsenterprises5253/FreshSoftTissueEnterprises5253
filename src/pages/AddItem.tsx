import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X, Save } from "lucide-react";

interface SparePart {
  id: string;
  gsm_number: string;
  price: number;
  stock_quantity: number;
  unit: string;
}

const AddItem = () => {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPart, setSelectedPart] = useState<SparePart | null>(null);
  const [customPrice, setCustomPrice] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number>(1);

  const navigate = useNavigate();

  // Load parts from LocalStorage instead of Supabase
  useEffect(() => {
    const storedParts = JSON.parse(localStorage.getItem("local_parts") || "[]");
    setParts(storedParts);
  }, []);

  const handleSave = () => {
    if (!selectedPart) {
      toast.error("Please select a part");
      return;
    }
    if (!customPrice || customPrice <= 0) {
      toast.error("Enter a valid selling price");
      return;
    }
    if (quantity <= 0) {
      toast.error("Enter a valid quantity");
      return;
    }

    const newItem = {
      ...selectedPart,
      price: Number(customPrice),
      quantity,
      total: Number(customPrice) * quantity,
    };

    // Save the item to sessionStorage — the Billing page will read this
    const existing =
      JSON.parse(sessionStorage.getItem("newBillItems") || "[]") || [];

    existing.push(newItem);
    sessionStorage.setItem("newBillItems", JSON.stringify(existing));

    toast.success("✅ Item added successfully!");
    navigate("/billing");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b pb-3">
        <h1 className="text-2xl font-bold"> Add New Item</h1>
        <Button
          variant="destructive"
          onClick={() => navigate("/billing")}
          className="flex items-center gap-2"
        >
          <X className="w-4 h-4" /> Cancel
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Input
          placeholder="Search by GSM Number..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedPart(null);
          }}
          className="w-full"
        />

        {/* Search Dropdown */}
        {search.length > 0 && (
          <div className="absolute z-50 bg-white border rounded-md shadow-md mt-1 w-full max-h-56 overflow-auto">
            {parts
              .filter((p) =>
                p.gsm_number.toLowerCase().includes(search.toLowerCase())
              )
              .slice(0, 10)
              .map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPart(p);
                    setSearch(p.gsm_number);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="font-medium">{p.gsm_number}</div>
                  <div className="text-xs text-gray-400">
                    Stock: {p.stock_quantity} {p.unit}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Selected Part */}
      {selectedPart && (
        <div className="p-4 border rounded-md bg-card shadow-sm">
          <p className="font-semibold text-lg">{selectedPart.gsm_number}</p>

          <div className="flex flex-wrap gap-4 mt-3">
            <Input
              type="number"
              placeholder="Selling Price"
              value={customPrice}
              onChange={(e) => setCustomPrice(Number(e.target.value))}
              className="w-40"
            />

            <Input
              type="number"
              placeholder="Quantity"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-40"
            />
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Item
        </Button>
      </div>
    </div>
  );
};

export default AddItem;
