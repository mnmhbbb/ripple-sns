import { useMutation } from "@tanstack/react-query";

import { updatePassword } from "@/api/auth";
import type { UseMutationCallbacks } from "@/types";

export function useUpdatePassword(callbacks?: UseMutationCallbacks) {
  return useMutation({
    mutationFn: updatePassword,
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
  });
}
