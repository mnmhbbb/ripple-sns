import { useMutation, useQueryClient } from "@tanstack/react-query";

import { togglePostLike } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { Post, UseMutationCallbacks } from "@/types";

export default function useTogglePostLike(callbacks?: UseMutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: togglePostLike,
    onMutate: async ({ postId }) => {
      // 1. 낙관적 업데이트 전, 데이터 요청이 있다면 취소
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.post.byId(postId),
      });

      // 2. 이전 데이터 백업(이전 데이터 롤백 가능성이 있기 때문)
      const prevPost = queryClient.getQueryData<Post>(
        QUERY_KEYS.post.byId(postId),
      );

      // 3. 낙관적 업데이트
      queryClient.setQueryData<Post>(QUERY_KEYS.post.byId(postId), (prev) => {
        if (!prev) throw new Error("포스트가 존재하지 않습니다.");
        return {
          ...prev,
          isLiked: !prev.isLiked,
          like_count: prev.isLiked ? prev.like_count - 1 : prev.like_count + 1,
        };
      });

      // 4. 낙관적 업데이트 실패 시, 이전 데이터로 롤백(onMutate 반환값을 onError의 context로 받을 수 있음)
      return { prevPost };
    },
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error, _, context) => {
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
