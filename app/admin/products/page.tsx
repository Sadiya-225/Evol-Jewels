"use client";

import { useState } from "react";
import { Package, Edit, Trash2, Check, X, Star, Eye, EyeOff } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

export default function AdminProductsPage() {
  const [page, setPage] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    name?: string;
    basePrice?: string;
    isActive?: boolean;
    isFeatured?: boolean;
  }>({});

  const limit = 10;
  const { data, isLoading, refetch } = trpc.admin.getProducts.useQuery({
    limit,
    offset: page * limit,
  });

  const updateProduct = trpc.admin.updateProduct.useMutation({
    onSuccess: () => {
      refetch();
      setEditingId(null);
      setEditValues({});
    },
  });

  const deleteProduct = trpc.admin.deleteProduct.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleEdit = (product: NonNullable<typeof data>["products"][0]) => {
    setEditingId(product.id);
    setEditValues({
      name: product.name,
      basePrice: product.basePrice,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
    });
  };

  const handleSave = () => {
    if (!editingId) return;
    updateProduct.mutate({
      id: editingId,
      ...editValues,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate({ id });
    }
  };

  const handleToggleActive = (id: string, currentValue: boolean) => {
    updateProduct.mutate({ id, isActive: !currentValue });
  };

  const handleToggleFeatured = (id: string, currentValue: boolean) => {
    updateProduct.mutate({ id, isFeatured: !currentValue });
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
          <h1 className="font-serif text-3xl text-evol-dark-grey">Products</h1>
          <p className="font-sans text-sm text-evol-metallic mt-1">
            Manage your product catalog
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-evol-metallic">
          <Package className="h-4 w-4" />
          <span>{data?.total || 0} total products</span>
        </div>
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
                  Category
                </th>
                <th className="px-4 py-3 text-left font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  Price
                </th>
                <th className="px-4 py-3 text-center font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  Stock
                </th>
                <th className="px-4 py-3 text-center font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  Status
                </th>
                <th className="px-4 py-3 text-center font-sans text-xs uppercase tracking-widest text-evol-metallic">
                  Featured
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
                    <td colSpan={7} className="px-4 py-4">
                      <div className="h-6 bg-evol-light-grey rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : data?.products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-evol-metallic">
                    No products found
                  </td>
                </tr>
              ) : (
                data?.products.map((product) => (
                  <tr key={product.id} className="hover:bg-evol-light-grey/30">
                    <td className="px-4 py-4">
                      {editingId === product.id ? (
                        <input
                          type="text"
                          value={editValues.name || ""}
                          onChange={(e) =>
                            setEditValues({ ...editValues, name: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-evol-grey rounded-sm font-sans text-sm"
                        />
                      ) : (
                        <span className="font-sans text-sm text-evol-dark-grey">
                          {product.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-sans text-sm text-evol-metallic">
                        {product.categoryName || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {editingId === product.id ? (
                        <input
                          type="text"
                          value={editValues.basePrice || ""}
                          onChange={(e) =>
                            setEditValues({ ...editValues, basePrice: e.target.value })
                          }
                          className="w-24 px-2 py-1 border border-evol-grey rounded-sm font-sans text-sm"
                        />
                      ) : (
                        <span className="font-sans text-sm text-evol-dark-grey">
                          {formatCurrency(product.basePrice)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={cn(
                          "font-sans text-sm",
                          product.stockQuantity < 5
                            ? "text-amber-600"
                            : "text-evol-dark-grey"
                        )}
                      >
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(product.id, product.isActive)}
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-sans transition-colors",
                          product.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-evol-light-grey text-evol-metallic hover:bg-evol-grey/50"
                        )}
                      >
                        {product.isActive ? (
                          <>
                            <Eye className="h-3 w-3" /> Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" /> Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(product.id, product.isFeatured)}
                        className={cn(
                          "p-1 rounded-sm transition-colors",
                          product.isFeatured
                            ? "text-amber-500 hover:text-amber-600"
                            : "text-evol-grey hover:text-evol-metallic"
                        )}
                      >
                        <Star
                          className={cn("h-5 w-5", product.isFeatured && "fill-current")}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === product.id ? (
                          <>
                            <button
                              onClick={handleSave}
                              disabled={updateProduct.isPending}
                              className="p-1 text-green-600 hover:bg-green-100 rounded-sm transition-colors"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditValues({});
                              }}
                              className="p-1 text-evol-metallic hover:bg-evol-light-grey rounded-sm transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-1 text-evol-metallic hover:text-evol-dark-grey hover:bg-evol-light-grey rounded-sm transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={deleteProduct.isPending}
                              className="p-1 text-evol-metallic hover:text-evol-red hover:bg-red-50 rounded-sm transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
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
