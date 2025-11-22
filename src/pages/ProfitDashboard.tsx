import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

// ----------------------------------------------------
// TYPES
// ----------------------------------------------------
interface BillRow {
  id: string;
  bill_number: string;
  customer_name: string;
  total_amount: number;
  created_at: string;
}

interface BillItemRow {
  id: string;
  bill_id: string;
  gsm_number: string;
  quantity: number;
  price: number;
  total: number;
  created_at: string;
}

interface ExpenseRow {
  id: string;
  item: string;
  qty: number;
  amount: number;
  created_at: string;
}

interface SparePart {
  id: string;
  gsm_number: string;
  category: string | null;
  price: number;
  cost_price: number | null;
}

interface MonthlyAgg {
  month: string;
  label: string;
  profit: number;
  expense: number;
  net: number;
}

// ----------------------------------------------------
// HELPERS
// ----------------------------------------------------
const toYYYYMM = (iso: string) => {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${mm}`;
};

const formatMonthLabel = (ym: string) => {
  const [y, m] = ym.split("-");
  const date = new Date(Number(y), Number(m) - 1, 1);
  return date.toLocaleString(undefined, { month: "short", year: "numeric" });
};

// ----------------------------------------------------
// COMPONENT
// ----------------------------------------------------
const ProfitDashboard: React.FC = () => {
  const [bills, setBills] = useState<BillRow[]>([]);
  const [items, setItems] = useState<BillItemRow[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [parts, setParts] = useState<SparePart[]>([]);

  const [loading, setLoading] = useState(false);

  // Filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterGsm, setFilterGsm] = useState("");

  // ----------------------------------------------------
  // LOAD LOCAL STORAGE DATA
  // ----------------------------------------------------
  useEffect(() => {
    setLoading(true);

    try {
      const localBills = JSON.parse(localStorage.getItem("local_bills") || "[]");
      const localItems = JSON.parse(localStorage.getItem("local_bill_items") || "[]");
      const localExpenses = JSON.parse(localStorage.getItem("local_expenses") || "[]");
      const localParts = JSON.parse(localStorage.getItem("local_spare_parts") || "[]");

      setBills(localBills);
      setItems(localItems);
      setExpenses(localExpenses);
      setParts(localParts);
    } catch (err) {
      toast.error("Failed to load report data");
    }

    setLoading(false);
  }, []);

  // ----------------------------------------------------
  // FILTER ITEM SALES
  // ----------------------------------------------------
  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      if (filterGsm && it.gsm_number !== filterGsm) return false;

      if (fromDate && new Date(it.created_at) < new Date(fromDate)) return false;
      if (toDate && new Date(it.created_at) > new Date(toDate)) return false;

      if (filterCategory) {
        const p = parts.find((pp) => pp.gsm_number === it.gsm_number);
        if (!p || (p.category || "") !== filterCategory) return false;
      }

      return true;
    });
  }, [items, filterGsm, fromDate, toDate, filterCategory, parts]);

  // ----------------------------------------------------
  // FILTER EXPENSES
  // ----------------------------------------------------
  const filteredExpenses = useMemo(() => {
    return expenses.filter((ex) => {
      if (fromDate && new Date(ex.created_at) < new Date(fromDate)) return false;
      if (toDate && new Date(ex.created_at) > new Date(toDate)) return false;
      return true;
    });
  }, [expenses, fromDate, toDate]);

  // ----------------------------------------------------
  // MONTHLY PROFIT AGGREGATION
  // ----------------------------------------------------
  const monthlyData: MonthlyAgg[] = useMemo(() => {
    const map = new Map<string, { profit: number; expense: number }>();

    // Profit from bill items
    for (const it of filteredItems) {
      const month = toYYYYMM(it.created_at);
      const part = parts.find((p) => p.gsm_number === it.gsm_number);
      const cost = part?.cost_price || 0;

      const profit = (it.price - cost) * it.quantity;

      if (!map.has(month)) map.set(month, { profit: 0, expense: 0 });
      map.get(month)!.profit += profit;
    }

    // Expenses
    for (const ex of filteredExpenses) {
      const month = toYYYYMM(ex.created_at);
      if (!map.has(month)) map.set(month, { profit: 0, expense: 0 });
      map.get(month)!.expense += ex.amount;
    }

    // Format output
    return Array.from(map.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([month, val]) => ({
        month,
        label: formatMonthLabel(month),
        profit: Number(val.profit.toFixed(2)),
        expense: Number(val.expense.toFixed(2)),
        net: Number((val.profit - val.expense).toFixed(2)),
      }));
  }, [filteredItems, filteredExpenses, parts]);

  // ----------------------------------------------------
  // SUMMARY CARD VALUES
  // ----------------------------------------------------
  const totalProfit = monthlyData.reduce((sum, m) => sum + m.profit, 0);
  const totalExpense = monthlyData.reduce((sum, m) => sum + m.expense, 0);
  const netTotal = totalProfit - totalExpense;

  const totalSales = bills.reduce((sum, bill) => sum + (bill.total_amount || 0), 0);

  // ----------------------------------------------------
  // LEDGER (PER ITEM PROFIT)
  // ----------------------------------------------------
  const ledger = useMemo(() => {
    return filteredItems.map((it) => {
      const part = parts.find((p) => p.gsm_number === it.gsm_number);
      const cost = part?.cost_price || 0;

      return {
        id: it.id,
        gsm: it.gsm_number,
        qty: it.quantity,
        price: it.price,
        cost,
        profitPerPiece: it.price - cost,
        profit: (it.price - cost) * it.quantity,
        date: it.created_at,
      };
    });
  }, [filteredItems, parts]);

  // ----------------------------------------------------
  // EXPORT CSV / XLSX / PDF
  // ----------------------------------------------------
  const exportCSV = () => {
    const rows = [
      "Month,Profit,Expense,Net",
      ...monthlyData.map((m) => `${m.label},${m.profit},${m.expense},${m.net}`),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "profit_report.csv";
    a.click();
  };

  const exportXLSX = async () => {
    try {
      const XLSX = (await import("xlsx")).default;
      const ws = XLSX.utils.json_to_sheet(monthlyData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, "profit_report.xlsx");
    } catch {
      toast.error("Please install xlsx: npm i xlsx");
    }
  };

  const exportPDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF();
      doc.text("Profit Report", 14, 20);
      const head = [["Month", "Profit", "Expense", "Net"]];
      const body = monthlyData.map((m) => [m.label, m.profit, m.expense, m.net]);
      // @ts-ignore
      autoTable(doc, { head, body, startY: 30 });
      doc.save("profit_report.pdf");
    } catch {
      toast.error("Please install jspdf & jspdf-autotable");
    }
  };

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📈 Profit Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">₹{totalProfit.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">₹{totalExpense.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{netTotal.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">₹{totalSales.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Export */}
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-sm">From</label>
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>

        <div>
          <label className="text-sm">To</label>
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>

        <div>
          <label className="text-sm">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All</option>
            {Array.from(
              new Set(parts.map((p) => p.category).filter(Boolean))
            ).map((cat) => (
              <option key={cat as string}>{cat as string}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm">GSM</label>
          <select
            value={filterGsm}
            onChange={(e) => setFilterGsm(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All</option>
            {parts.map((p) => (
              <option key={p.id} value={p.gsm_number}>
                {p.gsm_number}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex gap-2">
          <Button onClick={exportCSV}>CSV</Button>
          <Button onClick={exportXLSX}>XLSX</Button>
          <Button onClick={exportPDF}>PDF</Button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Profit / Expense</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="profit" fill="#16a34a" />
                <Bar dataKey="expense" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Profit Trend</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="net" stroke="#0ea5e9" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Profit Ledger */}
      <Card>
        <CardHeader>
          <CardTitle>Profit Ledger</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3">Date</th>
                  <th className="p-3">GSM</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Cost</th>
                  <th className="p-3">Profit/Piece</th>
                  <th className="p-3">Total Profit</th>
                </tr>
              </thead>

              <tbody>
                {ledger.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-3">
                      {new Date(row.date).toLocaleString()}
                    </td>
                    <td className="p-3">{row.gsm}</td>
                    <td className="p-3">{row.qty}</td>
                    <td className="p-3">₹{row.price.toFixed(2)}</td>
                    <td className="p-3">₹{row.cost.toFixed(2)}</td>
                    <td className="p-3">₹{row.profitPerPiece.toFixed(2)}</td>
                    <td className="p-3 font-bold">
                      ₹{row.profit.toFixed(2)}
                    </td>
                  </tr>
                ))}

                {ledger.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">
                      No data for selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitDashboard;
