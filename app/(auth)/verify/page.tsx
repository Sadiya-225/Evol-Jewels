"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const error = searchParams.get("error");

  useEffect(() => {
    // If there's an error in the URL (from BetterAuth redirect), show error state
    if (error) {
      setStatus("error");
      return;
    }

    // BetterAuth handles magic link verification automatically via /api/auth/magic-link/verify
    // If user lands here without error, show verifying then redirect
    const verifyToken = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setStatus("success");

        // Redirect to account page
        setTimeout(() => {
          router.push("/account");
        }, 1000);
      } catch {
        setStatus("error");
      }
    };

    verifyToken();
  }, [router, searchParams, error]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      {status === "verifying" && (
        <>
          <Loader2 className="h-12 w-12 text-evol-red animate-spin mx-auto mb-6" />
          <h1 className="font-serif text-3xl text-evol-dark-grey mb-2">
            Signing you in...
          </h1>
          <p className="font-body text-evol-metallic">This will just take a moment.</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="h-12 w-12 rounded-full bg-evol-red/10 flex items-center justify-center mx-auto mb-6">
            <svg
              className="h-6 w-6 text-evol-red"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-evol-dark-grey mb-2">Welcome back</h1>
          <p className="font-body text-evol-metallic">Redirecting you now...</p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="h-12 w-12 rounded-full bg-evol-red/10 flex items-center justify-center mx-auto mb-6">
            <svg
              className="h-6 w-6 text-evol-red"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-evol-dark-grey mb-2">
            Something shifted
          </h1>
          <p className="font-body text-evol-metallic mb-6">
            {error === "ATTEMPTS_EXCEEDED"
              ? "Too many attempts. Please request a new link."
              : "This link may have expired or already been used."}
          </p>
          <a
            href="/sign-in"
            className="inline-block px-6 py-3 bg-evol-red text-white font-sans text-sm uppercase tracking-widest hover:brightness-110 transition-all"
          >
            Try again
          </a>
        </>
      )}
    </motion.div>
  );
}

function VerifyFallback() {
  return (
    <div className="text-center">
      <Loader2 className="h-12 w-12 text-evol-red animate-spin mx-auto mb-6" />
      <h1 className="font-serif text-3xl text-evol-dark-grey mb-2">
        Signing you in...
      </h1>
      <p className="font-body text-evol-metallic">This will just take a moment.</p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-evol-light-grey flex items-center justify-center px-4">
      <Suspense fallback={<VerifyFallback />}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
