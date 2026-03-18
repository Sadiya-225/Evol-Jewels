import { authClient } from "@/lib/auth-client";

// Re-export useSession from BetterAuth client
export const useSession = authClient.useSession;

// Helper hook for sign out
export const useSignOut = () => {
  const signOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return { signOut };
};
