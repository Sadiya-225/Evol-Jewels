"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import SearchOverlay from "./SearchOverlay";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Stores", href: "/stores" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isAdmin } = useIsAdmin();

  // Mock cart count - will be replaced with Zustand state
  const cartItemCount = 0;

  // Get account link based on admin status
  const accountLink = session ? (isAdmin ? "/admin" : "/account") : "/sign-in";
  const accountLabel = session ? (isAdmin ? "Admin" : "Account") : "Sign In";

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-evol-light-grey border-b border-evol-grey backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="relative h-10 w-[90px]">
                <Image
                  src="/logos/Evol Jewels Logo - Black.png"
                  alt="Evol Jewels"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-sans text-xs uppercase tracking-widest transition-all duration-200 relative group",
                    isActive(link.href)
                      ? "text-evol-dark-grey"
                      : "text-evol-metallic hover:text-evol-dark-grey"
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="activeNavLink"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-evol-red"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {!isActive(link.href) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-evol-red scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="p-2 hover:text-evol-red transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                href={accountLink}
                aria-label={accountLabel}
                className="hidden sm:block p-2 hover:text-evol-red transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>
              <Link
                href="/cart"
                aria-label="Cart"
                className="relative p-2 hover:text-evol-red transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-evol-red text-white text-xs flex items-center justify-center font-sans">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                className="md:hidden p-2 hover:text-evol-red transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 top-16 z-40 bg-evol-off-white md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "font-sans text-2xl uppercase tracking-widest transition-colors",
                    isActive(link.href)
                      ? "text-evol-red font-medium"
                      : "text-evol-dark-grey hover:text-evol-red"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={accountLink}
                onClick={() => setMobileMenuOpen(false)}
                className="font-sans text-2xl uppercase tracking-widest text-evol-dark-grey hover:text-evol-red transition-colors"
              >
                {accountLabel}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
