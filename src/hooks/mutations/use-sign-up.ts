import { useMutation } from "@tanstack/react-query";

import { signUp } from "@/api/auth";
import type { UseMutationCallbacks } from "@/types";

export function useSignUp(callbacks?: UseMutationCallbacks) {
  return useMutation({
    mutationFn: signUp,
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
