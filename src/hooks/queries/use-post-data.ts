import { useQuery } from "@tanstack/react-query";

import { fetchPosts } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";

export function usePostData() {
  return useQuery({
    queryKey: QUERY_KEYS.post.list,
    queryFn: fetchPosts,
  });
}
