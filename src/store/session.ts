import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type State = {
  isLoaded: boolean;
  session: Session | null;
};

const initialState = {
  isLoaded: false,
  session: null,
} as State;

const useSessionStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        setSession: (session: Session | null) =>
          // devtools에서 액션이름을 자동으로 추론하지 못해서 명시적으로 추가함
          set({ session, isLoaded: true }, undefined, "setSession"),
      },
    })),
    {
      name: "sessionStore",
    },
  ),
);

export const useSession = () => {
  const session = useSessionStore((state) => state.session);
  return session;
};

export const useIsSessionLoaded = () => {
  const isLoaded = useSessionStore((state) => state.isLoaded);
  return isLoaded;
};

export const useSetSession = () => {
  const setSession = useSessionStore((state) => state.actions.setSession);
  return setSession;
};
