import { useEffect } from "react";

import GlobalLoader from "@/components/global-loader";
import supabase from "@/lib/supabase";
import { useIsSessionLoaded, useSetSession } from "@/store/session";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setSession = useSetSession();
  const isSessionLoaded = useIsSessionLoaded();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });
  }, [setSession]);

  if (!isSessionLoaded) return <GlobalLoader />;

  return children;
}
