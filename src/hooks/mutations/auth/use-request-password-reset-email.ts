import { useMutation } from "@tanstack/react-query";

import { requestPasswordResetEmail } from "@/api/auth";
import type { UseMutationCallbacks } from "@/types";

export function useRequestPasswordResetEmail(callbacks?: UseMutationCallbacks) {
  return useMutation({
    mutationFn: requestPasswordResetEmail,
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
  });
}
