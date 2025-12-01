import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteComment } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import type { Comment, UseMutationCallbacks } from "@/types";

export default function useDeleteComment(callbacks?: UseMutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (deletedComment) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      queryClient.setQueryData<Comment[]>(
        QUERY_KEYS.comment.post(deletedComment.post_id),
        (prevComments) => {
          if (!prevComments) throw new Error("댓글이 존재하지 않습니다.");
          return prevComments.filter(
            (comment) => comment.id !== deletedComment.id,
          );
        },
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
