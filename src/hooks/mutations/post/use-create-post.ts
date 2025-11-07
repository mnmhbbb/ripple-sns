import { useMutation } from "@tanstack/react-query";

import { createPost } from "@/api/post";
import type { UseMutationCallbacks } from "@/types";

export function useCreatePost(callbacks?: UseMutationCallbacks) {
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
