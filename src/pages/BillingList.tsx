import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Trash2, Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ================= TYPES =================
interface SavedBill {
  id: number;
  customer_name: string;
  payment_mode: string | null;
  status: string | null;
  bill_date: string;
  subtotal: number;
}

const BillingList = () => {
  const navigate = useNavigate();
  const [savedBills, setSavedBills] = useState<SavedBill[]>([]);

  // ✅ FETCH BILLS
  const fetchBills = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/billing");
      const data = await res.json();

      if (Array.isArray(data)) {
        const sorted = data.sort((a, b) => b.id - a.id); // NEWEST FIRST
        setSavedBills(data);
      } else {
        setSavedBills([]);
      }
    } catch (err) {
      console.error("Failed to load bills:", err);
      toast.error("Failed to load bills");
      setSavedBills([]);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // ✅ DELETE BILL (USING ID - CORRECT WAY)
  const deleteBill = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/billing/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Bill deleted successfully");
        fetchBills();
      } else {
        toast.error("Failed to delete bill");
      }
    } catch (err) {
      toast.error("Server error while deleting");
    }
  };

  return (
    <div className="p-10 w-full space-y-10">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          🧾 Billing Section
        </h1>

        <Button
          onClick={() => navigate("/billing/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-lg shadow"
        >
          + Add New Bill
        </Button>
      </div>

      {/* TABLE */}
      <div className="border rounded-lg p-6 bg-white shadow-md">
        <h2 className="text-xl font-semibold mb-4">Saved Bills</h2>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>Bill No</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {savedBills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  No bills found. Create one using “Add New Bill”.
                </TableCell>
              </TableRow>
            ) : (
              savedBills.map((b) => {
                const billNo = `INV-${String(b.id).padStart(4, "0")}`;

                return (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium text-blue-600">
                      {billNo}
                    </TableCell>

                    <TableCell>{b.customer_name}</TableCell>

                    <TableCell>
                      {new Date(b.bill_date).toLocaleDateString()}
                    </TableCell>

                    <TableCell>₹{Number(b.subtotal).toFixed(2)}</TableCell>

                    <TableCell>{b.payment_mode || "-"}</TableCell>

                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          b.status === "Paid"
                            ? "bg-green-600"
                            : b.status === "Unpaid"
                            ? "bg-red-600"
                            : "bg-yellow-600"
                        }`}
                      >
                        {b.status === "Pending" ? "New Invoice" : b.status}
                      </span>
                    </TableCell>

                    <TableCell className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/billing/${b.id}`)}
                        className="bg-blue-500 text-white"
                      >
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => navigate(`/billing/edit/${b.id}`)}
                        className="bg-yellow-500 text-white"
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>

                      {/* ✅ FIXED DELETE */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteBill(b.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BillingList;
