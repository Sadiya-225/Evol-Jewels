// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  tags: string[];
  isCustomizable: boolean;
  variants: ProductVariant[];
  specifications: ProductSpecifications;
  inStock: boolean;
}

export interface ProductVariant {
  id: string;
  goldKarat: "14K" | "18K" | "22K";
  goldColor: "Yellow" | "White" | "Rose";
  goldPurity: number;
  size?: string;
  price: number;
}

export interface ProductSpecifications {
  stoneType?: string;
  shape?: string;
  carat?: number;
  clarity?: string;
  cut?: string;
  color?: string;
  certification?: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  parentId?: string;
  image: string;
  description: string;
}

// Store Types
export interface Store {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
}

// Cart Types
export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

// Filter Types
export interface ProductFilters {
  category?: string;
  goldKarat?: ("14K" | "18K" | "22K")[];
  goldColor?: ("Yellow" | "White" | "Rose")[];
  priceRange?: [number, number];
  isCustomizable?: boolean;
  stoneType?: string[];
}

export type SortOption = "price-asc" | "price-desc" | "newest" | "popular";
