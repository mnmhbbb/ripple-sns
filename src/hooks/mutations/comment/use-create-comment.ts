import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createComment } from "@/api/comment";
import useProfileData from "@/hooks/queries/use-profile-data";
import { QUERY_KEYS } from "@/lib/constants";
import { useSession } from "@/store/session";
import type { Comment, Post, UseMutationCallbacks } from "@/types";

export default function useCreateComment(callbacks?: UseMutationCallbacks) {
  const queryClient = useQueryClient();
  const session = useSession();
  const { data: profile } = useProfileData(session?.user.id);

  return useMutation({
    mutationFn: createComment,
    onMutate: async ({ postId }) => {
      // 1. 포스트 낙관적 업데이트 전, 데이터 요청이 있다면 취소
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.post.byId(postId),
      });

      // 2. 이전 데이터 백업
      const prevPost = queryClient.getQueryData<Post>(
        QUERY_KEYS.post.byId(postId),
      );

      // 3. 낙관적 업데이트: comment_count 증가
      queryClient.setQueryData<Post>(QUERY_KEYS.post.byId(postId), (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comment_count: prev.comment_count + 1,
        };
      });

      return { prevPost };
    },
    onSuccess: (newComment) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      queryClient.setQueryData<Comment[]>(
        QUERY_KEYS.comment.post(newComment.post_id),
        (prevComments) => {
          if (!prevComments) throw new Error("댓글이 존재하지 않습니다.");
          if (!profile) throw new Error("프로필이 존재하지 않습니다.");
          return [...prevComments, { ...newComment, author: profile }];
        },
      );
    },
    onError: (error, _, context) => {
      // 낙관적 업데이트 실패 시 포스트 캐시 롤백
      if (context && context.prevPost) {
        queryClient.setQueryData<Post>(
          QUERY_KEYS.post.byId(context.prevPost.id),
          context.prevPost,
        );
      }
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
