import { useMutation } from "@tanstack/react-query";

import { signInWithPassword } from "@/api/auth";
import type { UseMutationCallbacks } from "@/types";

export function useSignInWithPassword(callbacks?: UseMutationCallbacks) {
  return useMutation({
    mutationFn: signInWithPassword,
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
