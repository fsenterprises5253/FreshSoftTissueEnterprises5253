import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";

interface DashboardProps {
  totalParts: number;
  totalValue: number;
  lowStockCount: number;
}

const Dashboard = ({ totalParts, totalValue, lowStockCount }: DashboardProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-none shadow-[var(--shadow-card)] bg-gradient-to-br from-card to-background hover:shadow-[var(--shadow-hover)] transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Parts
          </CardTitle>
          <Package className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalParts}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Active spare parts
          </p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-[var(--shadow-card)] bg-gradient-to-br from-card to-background hover:shadow-[var(--shadow-hover)] transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Inventory Value
          </CardTitle>
          <DollarSign className="h-5 w-5 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${totalValue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total stock value
          </p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-[var(--shadow-card)] bg-gradient-to-br from-card to-background hover:shadow-[var(--shadow-hover)] transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Average Price
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${totalParts > 0 ? (totalValue / totalParts).toFixed(2) : "0.00"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Per part average
          </p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-[var(--shadow-card)] bg-gradient-to-br from-card to-background hover:shadow-[var(--shadow-hover)] transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Low Stock Alert
          </CardTitle>
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{lowStockCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Items need reorder
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;