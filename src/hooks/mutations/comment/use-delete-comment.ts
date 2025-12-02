import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteComment, fetchComments } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import type { Post, UseMutationCallbacks } from "@/types";

export default function useDeleteComment(callbacks?: UseMutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();

      // 댓글 목록 가져오기 (CASCADE로 삭제된 하위 댓글들까지 정확히 반영하기 위함)
      const comments = await fetchComments(deletedComment.post_id);

      // 댓글 목록 캐시 업데이트
      queryClient.setQueryData(
        QUERY_KEYS.comment.post(deletedComment.post_id),
        comments,
      );

      // 댓글 개수를 세어서 post 캐시에 반영
      const commentCount = comments.length;
      queryClient.setQueryData<Post>(
        QUERY_KEYS.post.byId(deletedComment.post_id),
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            comment_count: commentCount,
          };
        },
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
