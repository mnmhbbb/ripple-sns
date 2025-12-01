import { useMutation } from "@tanstack/react-query";

import { createComment } from "@/api/comment";
import type { UseMutationCallbacks } from "@/types";

export default function useCreateComment(callbacks?: UseMutationCallbacks) {
  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
