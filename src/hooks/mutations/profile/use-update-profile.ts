import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProfile } from "@/api/profile";
import { QUERY_KEYS } from "@/lib/constants";
import type { ProfileEntity, UseMutationCallbacks } from "@/types";

export default function useUpdateProfile(callbacks: UseMutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess(updatedProfile) {
      if (callbacks.onSuccess) callbacks.onSuccess();
      // 캐시 데이터 갱신
      queryClient.setQueryData<ProfileEntity>(
        QUERY_KEYS.profile.byId(updatedProfile.id),
        updatedProfile,
      );
    },
    onError(error) {
      if (callbacks.onError) callbacks.onError(error);
    },
  });
}
