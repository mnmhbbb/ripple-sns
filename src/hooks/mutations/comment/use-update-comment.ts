import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateComment } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import type { Comment, UseMutationCallbacks } from "@/types";

export default function useUpdateComment(callbacks?: UseMutationCallbacks) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateComment,
    onSuccess: (updatedComment) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      queryClient.setQueryData<Comment[]>(
        QUERY_KEYS.comment.post(updatedComment.post_id),
        (prevComments) => {
          if (!prevComments) throw new Error("댓글이 존재하지 않습니다.");

          return prevComments.map((comment) => {
            if (comment.id === updatedComment.id)
              return { ...comment, ...updatedComment };
            return comment;
          });
        },
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
