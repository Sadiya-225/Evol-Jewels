"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Skeleton from "@/components/ui/Skeleton";
import { trpc } from "@/lib/trpc/client";

const goldKaratOptions = ["14K", "18K", "22K"] as const;
const goldColorOptions = ["Yellow", "White", "Rose"] as const;

type SortOption = "newest" | "price_asc" | "price_desc" | "name";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Get filters from URL
  const categoryFilter = searchParams.get("category") || "";
  const sortBy = (searchParams.get("sort") || "newest") as SortOption;

  // Filter state
  const [selectedGoldKarats, setSelectedGoldKarats] = useState<string[]>([]);
  const [selectedGoldColors, setSelectedGoldColors] = useState<string[]>([]);
  const [customizableOnly, setCustomizableOnly] = useState(false);

  // Fetch data
  const { data: categoriesData, isLoading: categoriesLoading } = trpc.categories.list.useQuery();
  const { data: productsData, isLoading: productsLoading } = trpc.products.list.useQuery({
    categoryId: categoryFilter || undefined,
    goldKarat: selectedGoldKarats[0],
    goldColor: selectedGoldColors[0],
    isCustomizable: customizableOnly || undefined,
    sortBy,
    limit: 50,
  });

  const categories = categoriesData || [];
  const products = productsData?.map((p) => ({
    ...p.product,
    category: p.category,
  })) || [];

  // Update URL with filters
  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const toggleFilter = (
    filterArray: string[],
    setFilterArray: (arr: string[]) => void,
    value: string
  ) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter((item) => item !== value));
    } else {
      setFilterArray([...filterArray, value]);
    }
  };

  // Breadcrumb
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
  ];

  if (categoryFilter) {
    const category = categories.find((c) => c.id === categoryFilter);
    if (category) {
      breadcrumbItems.push({ label: category.name, href: `/shop?category=${category.id}` });
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-evol-dark-grey mb-2">
              {categoryFilter
                ? categories.find((c) => c.id === categoryFilter)?.name || "Shop"
                : "All Products"}
            </h1>
            <p className="font-body text-sm text-evol-metallic">
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </p>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border border-evol-grey text-evol-dark-grey hover:border-evol-dark-grey transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`${
              mobileFiltersOpen ? "block" : "hidden"
            } md:block w-full md:w-64 shrink-0 space-y-6`}
          >
            {/* Sort */}
            <div>
              <h3 className="font-sans text-xs uppercase tracking-widest text-evol-dark-grey mb-4">
                Sort By
              </h3>
              <select
                value={sortBy}
                onChange={(e) => updateFilters("sort", e.target.value)}
                className="w-full px-3 py-2 border border-evol-grey text-evol-dark-grey font-body text-sm focus:outline-none focus:border-evol-red"
              >
                <option value="newest">Newest</option>
                <option value="name">Name</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-sans text-xs uppercase tracking-widest text-evol-dark-grey mb-4">
                Category
              </h3>
              {categoriesLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => updateFilters("category", "")}
                    className={`block w-full text-left px-3 py-2 text-sm font-body transition-colors ${
                      !categoryFilter
                        ? "bg-evol-light-grey text-evol-dark-grey"
                        : "text-evol-metallic hover:text-evol-dark-grey"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => updateFilters("category", category.id)}
                      className={`block w-full text-left px-3 py-2 text-sm font-body transition-colors ${
                        categoryFilter === category.id
                          ? "bg-evol-light-grey text-evol-dark-grey"
                          : "text-evol-metallic hover:text-evol-dark-grey"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Gold Karat Filter */}
            <div>
              <h3 className="font-sans text-xs uppercase tracking-widest text-evol-dark-grey mb-4">
                Gold Karat
              </h3>
              <div className="space-y-2">
                {goldKaratOptions.map((karat) => (
                  <label key={karat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedGoldKarats.includes(karat)}
                      onChange={() =>
                        toggleFilter(selectedGoldKarats, setSelectedGoldKarats, karat)
                      }
                      className="h-4 w-4 text-evol-red border-evol-grey focus:ring-evol-red"
                    />
                    <span className="font-body text-sm text-evol-dark-grey">{karat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gold Color Filter */}
            <div>
              <h3 className="font-sans text-xs uppercase tracking-widest text-evol-dark-grey mb-4">
                Gold Color
              </h3>
              <div className="space-y-2">
                {goldColorOptions.map((color) => (
                  <label key={color} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedGoldColors.includes(color)}
                      onChange={() =>
                        toggleFilter(selectedGoldColors, setSelectedGoldColors, color)
                      }
                      className="h-4 w-4 text-evol-red border-evol-grey focus:ring-evol-red"
                    />
                    <span className="font-body text-sm text-evol-dark-grey">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Customizable Filter */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customizableOnly}
                  onChange={() => setCustomizableOnly(!customizableOnly)}
                  className="h-4 w-4 text-evol-red border-evol-grey focus:ring-evol-red"
                />
                <span className="font-body text-sm text-evol-dark-grey">
                  Customizable only
                </span>
              </label>
            </div>

            {/* Close button for mobile */}
            {mobileFiltersOpen && (
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="md:hidden w-full mt-4"
              >
                <Button variant="secondary" className="w-full">
                  Apply Filters
                </Button>
              </button>
            )}
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index}>
                    <Skeleton className="aspect-square w-full mb-4" />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-body text-evol-metallic">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className="group"
                  >
                    <Link href={`/shop/${product.id}`}>
                      <div className="relative aspect-square bg-evol-light-grey overflow-hidden mb-4">
                        {product.images && product.images.length > 0 && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:-translate-y-1"
                          />
                        )}
                        {product.isFeatured && (
                          <div className="absolute top-4 right-4">
                            <Badge variant="promotional">Featured</Badge>
                          </div>
                        )}
                      </div>

                      <h3 className="font-sans text-sm font-medium text-evol-dark-grey mb-1">
                        {product.name}
                      </h3>
                      <p className="font-body text-sm text-evol-dark-grey mb-3">
                        ₹{parseFloat(product.basePrice).toLocaleString("en-IN")}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {product.category && (
                          <Badge variant="default">
                            {product.category.name}
                          </Badge>
                        )}
                      </div>

                      <Button variant="secondary" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShopFallback() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="aspect-square w-full mb-4" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopContent />
    </Suspense>
  );
}
