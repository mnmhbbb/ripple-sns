import { useQuery } from "@tanstack/react-query";

import { fetchPosts } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";

export default function usePostData() {
  return useQuery({
    queryKey: QUERY_KEYS.post.list,
    queryFn: () => fetchPosts({ from: 0, to: 5 }), // 임시
  });
}
