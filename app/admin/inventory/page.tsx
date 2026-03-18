"use client";

import { useState } from "react";
import { Warehouse, Filter, AlertTriangle, Check, X, Edit } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

export default function AdminInventoryPage() {
  const [page, setPage] = useState(0);
  const [storeFilter, setStoreFilter] = useState<string>("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  const limit = 15;
  const { data, isLoading, refetch } = trpc.admin.getInventory.useQuery({
    limit,
    offset: page * limit,
    storeId: storeFilter || undefined,
    lowStock: lowStockOnly || undefined,
  });

  const { data: stores } = trpc.admin.getStores.useQuery();

  const updateInventory = trpc.admin.updateInventory.useMutation({
    onSuccess: () => {
      refetch();
      setEditingId(null);
    },
  });

  const handleEdit = (id: string, currentQuantity: number) => {
    setEditingId(id);
    setEditQuantity(currentQuantity);
  };

  const handleSave = () => {
    if (!editingId) return;
    updateInventory.mutate({
      id: editingId,
      quantity: editQuantity,
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-evol-dark-grey">Inventory</h1>
          <p className="font-sans text-sm text-evol-metallic mt-1">
            Track and manage stock levels across stores
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-evol-metallic">
          <Warehouse className="h-4 w-4" />
          <span>{data?.total || 0} inventory items</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-evol-metallic" />
          <select
            value={storeFilter}
            onChange={(e) => {
              setStoreFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 border border-evol-grey rounded-sm font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-evol-red/20"
          >
            <option value="">All Stores</option>
            {stores?.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name} ({store.city})
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => {
              setLowStockOnly(e.target.checked);
              setPage(0);
            }}
            className="w-4 h-4 rounded border-evol-grey text-evol-red focus:ring-evol-red/20"
          />
          <span className="font-sans text-sm text-evol-dark-grey flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Low Stock Only
          </span>
        </label>
      </div>

      {/* Table */}
      <div className="bg-white border border-evol-grey rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-evol-light-grey">
              <tr>
                <th className="px-4 py-3 text-left font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  Product
                </th>
                <th className="px-4 py-3 text-left font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  Variant
                </th>
                <th className="px-4 py-3 text-left font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  SKU
                </th>
                <th className="px-4 py-3 text-left font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  Store
                </th>
                <th className="px-4 py-3 text-right font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  Price
                </th>
                <th className="px-4 py-3 text-center font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  Qty
                </th>
                <th className="px-4 py-3 text-center font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  Reserved
                </th>
                <th className="px-4 py-3 text-center font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-evol-grey/50">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={9} className="px-4 py-4">
                      <div className="h-6 bg-evol-light-grey rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : data?.items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-evol-metallic">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                data?.items.map((item) => (
                  <tr
                    key={item.id}
                    className={cn(
                      "hover:bg-evol-light-grey/30",
                      item.quantity < 5 && "bg-amber-50/50"
                    )}
                  >
                    <td className="px-4 py-4">
                      <span className="font-sans text-sm text-evol-dark-grey">
                        {item.productName || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-sans text-sm text-evol-metallic">
                        {item.baseVariantName || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-evol-metallic">
                        {item.variantSku || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-sans text-sm text-evol-metallic">
                        {item.storeName || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-sans text-sm text-evol-dark-grey">
                        {item.variantPrice ? formatCurrency(item.variantPrice) : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {editingId === item.id ? (
                        <input
                          type="number"
                          min="0"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-center border border-evol-grey rounded-sm font-sans text-sm"
                        />
                      ) : (
                        <span
                          className={cn(
                            "font-sans text-sm font-medium",
                            item.quantity < 5 ? "text-amber-600" : "text-evol-dark-grey"
                          )}
                        >
                          {item.quantity}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-sans text-sm text-evol-metallic">
                        {item.reservedQuantity}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {item.quantity === 0 ? (
                        <span className="inline-flex px-2 py-1 rounded-sm bg-red-100 text-red-700 font-sans text-xs">
                          Out of Stock
                        </span>
                      ) : item.quantity < 5 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-amber-100 text-amber-700 font-sans text-xs">
                          <AlertTriangle className="h-3 w-3" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded-sm bg-green-100 text-green-700 font-sans text-xs">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === item.id ? (
                          <>
                            <button
                              onClick={handleSave}
                              disabled={updateInventory.isPending}
                              className="p-1 text-green-600 hover:bg-green-100 rounded-sm transition-colors"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 text-evol-metallic hover:bg-evol-light-grey rounded-sm transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEdit(item.id, item.quantity)}
                            className="p-1 text-evol-metallic hover:text-evol-dark-grey hover:bg-evol-light-grey rounded-sm transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
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
