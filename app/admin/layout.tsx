"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";
import { authClient } from "@/lib/auth-client";

const adminNavLinks = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Inventory", href: "/admin/inventory", icon: Warehouse },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // Check admin role after session loads
    if (!isPending && session) {
      // Fetch user details to check role
      const checkAdminRole = async () => {
        try {
          const response = await fetch("/api/auth/check-admin");
          const data = await response.json();
          if (data.isAdmin) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            router.push("/account");
          }
        } catch {
          setIsAdmin(false);
          router.push("/account");
        }
      };
      checkAdminRole();
    } else if (!isPending && !session) {
      router.push("/sign-in?callbackUrl=/admin");
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  // Show loading state
  if (isPending || isAdmin === null) {
    return (
      <div className="min-h-screen bg-evol-light-grey flex items-center justify-center">
        <div className="animate-pulse text-evol-metallic font-sans text-sm uppercase tracking-widest">
          Loading...
        </div>
      </div>
    );
  }

  // Don't render if not admin (will redirect)
  if (!isAdmin) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-evol-light-grey rounded-sm"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <X className="h-5 w-5 text-evol-dark-grey" />
        ) : (
          <Menu className="h-5 w-5 text-evol-dark-grey" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-evol-light-grey border-r border-evol-grey flex flex-col transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo/Title */}
        <div className="h-16 flex items-center justify-center border-b border-evol-grey">
          <Link href="/admin" className="font-serif text-xl text-evol-dark-grey">
            Admin Panel
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {adminNavLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-sm font-sans text-sm transition-colors",
                  isActive(link.href)
                    ? "bg-evol-dark-grey text-white"
                    : "text-evol-dark-grey hover:bg-evol-grey/50"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-evol-grey">
          <div className="px-4 py-2 mb-2">
            <p className="font-sans text-xs text-evol-metallic uppercase tracking-wider">
              Signed in as
            </p>
            <p className="font-sans text-sm text-evol-dark-grey truncate">
              {session?.user?.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm font-sans text-sm text-evol-dark-grey hover:bg-evol-grey/50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
          <Link
            href="/"
            className="block mt-2 px-4 py-2 font-sans text-xs text-evol-metallic hover:text-evol-dark-grey transition-colors text-center"
          >
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
