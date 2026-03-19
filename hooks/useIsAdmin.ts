"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/hooks/useSession";

export function useIsAdmin() {
  const { data: session, isPending: sessionPending } = useSession();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    if (sessionPending) {
      return;
    }

    if (!session) {
      setIsAdmin(false);
      setIsPending(false);
      return;
    }

    // Check admin status
    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/auth/check-admin");
        const data = await response.json();
        setIsAdmin(data.isAdmin === true);
      } catch {
        setIsAdmin(false);
      } finally {
        setIsPending(false);
      }
    };

    checkAdmin();
  }, [session, sessionPending]);

  return { isAdmin, isPending: sessionPending || isPending };
}
