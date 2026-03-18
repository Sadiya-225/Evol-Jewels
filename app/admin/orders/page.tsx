"use client";

import { useState } from "react";
import { ShoppingCart, Filter } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { value: "processing", label: "Processing", color: "bg-indigo-100 text-indigo-800" },
  { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-800" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

export default function AdminOrdersPage() {
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const limit = 10;
  const { data, isLoading, refetch } = trpc.admin.getOrders.useQuery({
    limit,
    offset: page * limit,
    status: statusFilter || undefined,
  });

  const updateStatus = trpc.admin.updateOrderStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatus.mutate({
      id: orderId,
      status: newStatus as "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getStatusStyle = (status: string) => {
    return ORDER_STATUSES.find((s) => s.value === status)?.color || "bg-gray-100 text-gray-800";
  };

  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-evol-dark-grey">Orders</h1>
          <p className="font-sans text-sm text-evol-metallic mt-1">
            Manage and track customer orders
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-evol-metallic">
          <ShoppingCart className="h-4 w-4" />
          <span>{data?.total || 0} total orders</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-evol-metallic" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 border border-evol-grey rounded-sm font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-evol-red/20"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-evol-grey rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-evol-light-grey">
              <tr>
                <th className="px-4 py-3 text-left font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  Order
                </th>
                <th className="px-4 py-3 text-left font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  Store
                </th>
                <th className="px-4 py-3 text-right font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  Total
                </th>
                <th className="px-4 py-3 text-center font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-evol-grey/50">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-4">
                      <div className="h-6 bg-evol-light-grey rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : data?.orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-evol-metallic">
                    No orders found
                  </td>
                </tr>
              ) : (
                data?.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-evol-light-grey/30">
                    <td className="px-4 py-4">
                      <span className="font-sans text-sm font-medium text-evol-dark-grey">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-sans text-sm text-evol-metallic">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-sans text-sm text-evol-metallic">
                        {order.storeName || "Online"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-sans text-sm font-medium text-evol-dark-grey">
                        {formatCurrency(order.total)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updateStatus.isPending}
                          className={cn(
                            "px-3 py-1 rounded-sm font-sans text-xs font-medium cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-evol-red/20",
                            getStatusStyle(order.status),
                            updateStatus.isPending && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-evol-light-grey border-t border-evol-grey flex items-center justify-between">
            <span className="font-sans text-sm text-evol-metallic">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 font-sans text-sm border border-evol-grey rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 font-sans text-sm border border-evol-grey rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
