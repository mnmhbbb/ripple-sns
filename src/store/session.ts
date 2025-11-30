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
      name: "SessionStore",
    },
  ),
);

export const useSession = () => {
  const session = useSessionStore((state) => state.session);
  return session;
};

// onAuthStateChange는 최초 마운트 이후에 실행되기 때문에
// 최초 마운트 시점에는 세션이 없어서 페이지 권한이 없다고 튕겨지거나, 잠시 어색하게 버튼이 생겼다가 없어지는 현상이 발생할 수 있음
// 따라서 isLoaded 상태를 사용하여 최초 마운트 시점에는 로딩 중임을 표시하기 위함
// session-provider에서 사용함
export const useIsSessionLoaded = () => {
  const isLoaded = useSessionStore((state) => state.isLoaded);
  return isLoaded;
};

export const useSetSession = () => {
  const setSession = useSessionStore((state) => state.actions.setSession);
  return setSession;
};
