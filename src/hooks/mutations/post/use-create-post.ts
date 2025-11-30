import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPostWithImages } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import { useSession } from "@/store/session";
import type { UseMutationCallbacks } from "@/types";

export default function useCreatePost(callbacks?: UseMutationCallbacks) {
  const queryClient = useQueryClient();
  const session = useSession();

  return useMutation({
    mutationFn: createPostWithImages,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();

      // invalidate를 사용하면 캐싱된 전체 데이터를 무효화하기 때문에, 피드 자체를 초기화에서 데이터를 1페이지부터 불러오도록 하기 위해 resetQueries를 사용함.
      queryClient.resetQueries({ queryKey: QUERY_KEYS.post.list });
      queryClient.resetQueries({
        queryKey: QUERY_KEYS.post.userList(session!.user.id),
      });
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
