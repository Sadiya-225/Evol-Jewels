"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc/client";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce the search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset query when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setDebouncedQuery("");
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when overlay is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Search query
  const { data: searchResults, isLoading } = trpc.products.search.useQuery(
    { query: debouncedQuery, limit: 8 },
    { enabled: debouncedQuery.length >= 2 }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleProductClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-white"
        >
          {/* Header */}
          <div className="border-b border-evol-grey">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center gap-4">
                <form onSubmit={handleSubmit} className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-1.5 top-1/2 -translate-y-1/2 h-5 w-5 text-evol-metallic" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search for products..."
                      className="w-full pl-8 pr-4 py-2 font-sans text-lg bg-transparent border-none outline-none placeholder:text-evol-metallic"
                    />
                  </div>
                </form>
                <button
                  onClick={onClose}
                  className="p-2 text-evol-metallic hover:text-evol-dark-grey transition-colors"
                  aria-label="Close search"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="max-w-4xl mx-auto px-4 py-8 overflow-y-auto max-h-[calc(100vh-80px)]">
            {/* Loading state */}
            {isLoading && debouncedQuery.length >= 2 && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-evol-metallic animate-spin" />
              </div>
            )}

            {/* Empty state - no query */}
            {!debouncedQuery && (
              <div className="text-center py-12">
                <p className="font-body text-evol-metallic">
                  Start typing to search for products...
                </p>
              </div>
            )}

            {/* Empty state - query too short */}
            {debouncedQuery && debouncedQuery.length < 2 && (
              <div className="text-center py-12">
                <p className="font-body text-evol-metallic">
                  Enter at least 2 characters to search
                </p>
              </div>
            )}

            {/* No results */}
            {!isLoading &&
              debouncedQuery.length >= 2 &&
              searchResults?.length === 0 && (
                <div className="text-center py-12">
                  <p className="font-body text-evol-metallic mb-4">
                    No products found for &quot;{debouncedQuery}&quot;
                  </p>
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="font-sans text-sm uppercase tracking-widest text-evol-red hover:underline"
                  >
                    Browse all products
                  </Link>
                </div>
              )}

            {/* Results grid */}
            {!isLoading && searchResults && searchResults.length > 0 && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="font-sans text-xs uppercase tracking-widest text-evol-metallic">
                    {searchResults.length} result
                    {searchResults.length !== 1 ? "s" : ""} for &quot;
                    {debouncedQuery}&quot;
                  </p>
                  <Link
                    href={`/search?q=${encodeURIComponent(debouncedQuery)}`}
                    onClick={onClose}
                    className="font-sans text-xs uppercase tracking-widest text-evol-red hover:underline"
                  >
                    View all results
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {searchResults.map((item) => (
                    <Link
                      key={item.product.id}
                      href={`/shop/${item.product.id}`}
                      onClick={handleProductClick}
                      className="group"
                    >
                      <div className="relative aspect-square bg-evol-light-grey overflow-hidden mb-2">
                        {item.product.images && item.product.images.length > 0 && (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <h3 className="font-sans text-sm text-evol-dark-grey group-hover:text-evol-red transition-colors line-clamp-1">
                        {item.product.name}
                      </h3>
                      <p className="font-body text-sm text-evol-metallic">
                        ₹{parseFloat(item.product.basePrice).toLocaleString("en-IN")}
                      </p>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
