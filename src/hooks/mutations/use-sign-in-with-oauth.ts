import { useMutation } from "@tanstack/react-query";

import { signInWithOAuth } from "@/api/auth";
import type { UseMutationCallbacks } from "@/types";

export function useSignInWithOAuth(callbacks?: UseMutationCallbacks) {
  return useMutation({
    mutationFn: signInWithOAuth,
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
