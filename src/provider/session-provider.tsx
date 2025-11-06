import { useEffect } from "react";

import GlobalLoader from "@/components/global-loader";
import { useProfileData } from "@/hooks/queries/use-profile-data";
import supabase from "@/lib/supabase";
import { useIsSessionLoaded, useSession, useSetSession } from "@/store/session";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const setSession = useSetSession();
  const isSessionLoaded = useIsSessionLoaded();

  const { isLoading: isProfileLoading } = useProfileData(session?.user?.id);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });
  }, [setSession]);

  if (!isSessionLoaded) return <GlobalLoader />;
  if (isProfileLoading) return <GlobalLoader />;

  return children;
}
