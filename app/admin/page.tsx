"use client";

import { ShoppingCart, DollarSign, AlertTriangle, Package, Clock, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc/client";

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  variant = "default",
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  variant?: "default" | "warning" | "success";
}) {
  const bgColors = {
    default: "bg-white",
    warning: "bg-amber-50",
    success: "bg-green-50",
  };

  const iconColors = {
    default: "text-evol-dark-grey",
    warning: "text-amber-600",
    success: "text-green-600",
  };

  return (
    <div className={`${bgColors[variant]} border border-evol-grey rounded-sm p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-evol-metallic mb-1">
            {title}
          </p>
          <p className="font-serif text-3xl text-evol-dark-grey">{value}</p>
          {description && (
            <p className="font-sans text-sm text-evol-metallic mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-sm bg-evol-light-grey ${iconColors[variant]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const { data: stats, isLoading } = trpc.admin.getDashboardStats.useQuery();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-evol-light-grey rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-evol-light-grey rounded" />
          ))}
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-evol-dark-grey">Dashboard</h1>
        <p className="font-sans text-sm text-evol-metallic mt-1">
          Welcome back. Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Orders Today"
          value={stats?.ordersToday || 0}
          icon={ShoppingCart}
          description="New orders received"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.revenue || 0)}
          icon={DollarSign}
          variant="success"
          description="From completed payments"
        />
        <StatCard
          title="Low Stock Items"
          value={stats?.lowStockItems || 0}
          icon={AlertTriangle}
          variant={stats?.lowStockItems && stats.lowStockItems > 0 ? "warning" : "default"}
          description="Items with quantity < 5"
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon={Package}
          description="In your catalog"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={TrendingUp}
          description="All time"
        />
        <StatCard
          title="Pending Orders"
          value={stats?.pendingOrders || 0}
          icon={Clock}
          variant={stats?.pendingOrders && stats.pendingOrders > 0 ? "warning" : "default"}
          description="Awaiting processing"
        />
      </div>

      {/* Quick Actions */}
      <div className="border-t border-evol-grey pt-8">
        <h2 className="font-serif text-xl text-evol-dark-grey mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/products"
            className="p-4 bg-evol-light-grey hover:bg-evol-grey/50 transition-colors rounded-sm text-center"
          >
            <Package className="h-6 w-6 mx-auto mb-2 text-evol-dark-grey" />
            <span className="font-sans text-sm text-evol-dark-grey">Manage Products</span>
          </a>
          <a
            href="/admin/orders"
            className="p-4 bg-evol-light-grey hover:bg-evol-grey/50 transition-colors rounded-sm text-center"
          >
            <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-evol-dark-grey" />
            <span className="font-sans text-sm text-evol-dark-grey">View Orders</span>
          </a>
          <a
            href="/admin/inventory"
            className="p-4 bg-evol-light-grey hover:bg-evol-grey/50 transition-colors rounded-sm text-center"
          >
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-evol-dark-grey" />
            <span className="font-sans text-sm text-evol-dark-grey">Check Inventory</span>
          </a>
          <a
            href="/"
            className="p-4 bg-evol-light-grey hover:bg-evol-grey/50 transition-colors rounded-sm text-center"
          >
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-evol-dark-grey" />
            <span className="font-sans text-sm text-evol-dark-grey">View Store</span>
          </a>
        </div>
      </div>
    </div>
  );
}
