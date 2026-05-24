import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthState {
  session: Session | null;
  bootstrapped: boolean;
  setSession: (session: Session | null) => void;
  setBootstrapped: (bootstrapped: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  bootstrapped: false,
  setSession: (session) => set({ session }),
  setBootstrapped: (bootstrapped) => set({ bootstrapped })
}));
