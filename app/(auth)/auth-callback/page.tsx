"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const checkAdminAndRedirect = async () => {
      try {
        const response = await fetch("/api/auth/check-admin");
        const data = await response.json();

        if (data.isAdmin) {
          router.replace("/admin");
        } else {
          router.replace("/account");
        }
      } catch {
        // If check fails, redirect to account as fallback
        setError(true);
        setTimeout(() => {
          router.replace("/account");
        }, 2000);
      }
    };

    checkAdminAndRedirect();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-evol-light-grey flex flex-col items-center justify-center px-4">
        <Link href="/">
          <Image
            src="/logos/Evol Jewels Logo - Black.png"
            alt="Evol Jewels"
            width={120}
            height={48}
            className="h-10 w-auto mb-8"
          />
        </Link>
        <p className="font-body text-evol-metallic">
          Redirecting to your account...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-evol-light-grey flex flex-col items-center justify-center px-4">
      <Link href="/">
        <Image
          src="/logos/Evol Jewels Logo - Black.png"
          alt="Evol Jewels"
          width={120}
          height={48}
          className="h-10 w-auto mb-8"
        />
      </Link>
      <div className="animate-pulse text-evol-metallic font-sans text-sm uppercase tracking-widest">
        Signing you in...
      </div>
    </div>
  );
}
