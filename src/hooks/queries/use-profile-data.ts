import type { PostgrestError } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

import { createProfile, fetchProfile } from "@/api/profile";
import { QUERY_KEYS } from "@/lib/constants";
import { useSession } from "@/store/session";

export function useProfileData(userId?: string) {
  const session = useSession();
  const isMine = session?.user?.id === userId;

  return useQuery({
    queryKey: QUERY_KEYS.profile.byId(userId!),
    queryFn: async () => {
      try {
        const profile = await fetchProfile(userId!);
        return profile;
      } catch (error) {
        // 나의 프로필 조회일 경우만 새로운 프로필 생성
        // (Supabase 에러 코드: PGRST116 = 데이터가 존재하지 않음)
        if (isMine && (error as PostgrestError).code === "PGRST116") {
          return await createProfile(userId!);
        }
        throw error;
      }
    },
    enabled: !!userId, // enabled가 false일 때는 queryFn이 실행되지 않기 때문에 queryKey와 queryFn에서 userId 타입을 단언함
  });
}
