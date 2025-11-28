import { useMutation } from "@tanstack/react-query";

import { deleteImagesInPath } from "@/api/image";
import { deletePost } from "@/api/post";
import type { UseMutationCallbacks } from "@/types";

export function useDeletePost(callbacks?: UseMutationCallbacks) {
  return useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletePost) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();

      // 이미지 삭제:
      if (deletePost.image_urls && deletePost.image_urls.length > 0) {
        await deleteImagesInPath(`${deletePost.author_id}/${deletePost.id}`);
      }
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
