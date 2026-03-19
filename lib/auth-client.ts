import { createAuthClient } from "better-auth/react";
import { emailOTPClient, magicLinkClient } from "better-auth/client/plugins";

// Normalize URL - remove trailing slash
const baseURL = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

export const authClient = createAuthClient({
  baseURL,
  plugins: [emailOTPClient(), magicLinkClient()],
});

export const {
  useSession,
  signIn,
  signOut,
  signUp,
} = authClient;
