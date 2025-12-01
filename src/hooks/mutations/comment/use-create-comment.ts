import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createComment } from "@/api/comment";
import useProfileData from "@/hooks/queries/use-profile-data";
import { QUERY_KEYS } from "@/lib/constants";
import { useSession } from "@/store/session";
import type { Comment, UseMutationCallbacks } from "@/types";

export default function useCreateComment(callbacks?: UseMutationCallbacks) {
  const queryClient = useQueryClient();
  const session = useSession();
  const { data: profile } = useProfileData(session?.user.id);

  return useMutation({
    mutationFn: createComment,
    onSuccess: (newComment) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      queryClient.setQueryData<Comment[]>(
        QUERY_KEYS.comment.post(newComment.post_id),
        (prevComments) => {
          if (!prevComments) throw new Error("댓글이 존재하지 않습니다.");
          if (!profile) throw new Error("프로필이 존재하지 않습니다.");
          return [{ ...newComment, author: profile }, ...prevComments];
        },
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
