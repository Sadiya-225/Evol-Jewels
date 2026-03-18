"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantId: string;
  goldKarat: string;
  goldColor: string;
  size?: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems((items) => items.filter((item) => item.id !== itemId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.03; // 3% GST estimate
  const total = subtotal + gst;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Cart" },
  ];

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <h1 className="font-serif text-4xl md:text-5xl text-evol-dark-grey mb-4">
              Your story is still being written.
            </h1>
            <p className="font-body text-evol-metallic mb-8">
              Your cart is empty. Discover pieces that speak to you.
            </p>
            <Link href="/shop">
              <Button variant="primary">Explore Shop</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h1 className="font-serif text-4xl md:text-5xl text-evol-dark-grey mb-12">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex gap-4 pb-6 border-b border-evol-grey last:border-b-0"
              >
                {/* Image */}
                <Link
                  href={`/shop/${item.productId}`}
                  className="relative w-24 h-24 shrink-0 bg-evol-light-grey"
                >
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/shop/${item.productId}`}
                    className="font-sans text-sm font-medium text-evol-dark-grey hover:text-evol-red transition-colors"
                  >
                    {item.productName}
                  </Link>
                  <div className="font-body text-xs text-evol-metallic mt-1 space-y-0.5">
                    <p>
                      {item.goldKarat} {item.goldColor} Gold
                    </p>
                    {item.size && <p>Size: {item.size}</p>}
                  </div>
                  <p className="font-body text-sm text-evol-dark-grey mt-2">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Quantity & Remove */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                    className="text-evol-metallic hover:text-evol-red transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-3 border border-evol-grey">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="p-2 hover:bg-evol-light-grey transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-sans text-sm w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="p-2 hover:bg-evol-light-grey transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-evol-light-grey p-6 sticky top-24">
              <h2 className="font-sans text-xs uppercase tracking-widest text-evol-dark-grey mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 font-body text-sm">
                <div className="flex justify-between">
                  <span className="text-evol-metallic">Subtotal</span>
                  <span className="text-evol-dark-grey">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-evol-metallic">Estimated GST (3%)</span>
                  <span className="text-evol-dark-grey">
                    ₹{gst.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="pt-4 border-t border-evol-grey flex justify-between font-sans text-base">
                  <span className="text-evol-dark-grey">Total</span>
                  <span className="text-evol-dark-grey font-medium">
                    ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              <Button variant="primary" className="w-full mt-6">
                Proceed to Checkout
              </Button>

              <p className="font-body text-xs text-evol-metallic text-center mt-4">
                Shipping and taxes calculated at checkout
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
