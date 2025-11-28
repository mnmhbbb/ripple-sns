import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchPosts } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";

const PAGE_SIZE = 5;

export function useInfinitePostsData() {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.post.list,
    queryFn: async ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE;

      const posts = await fetchPosts({ from, to });
      return posts;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // 마지막 페이지의 게시물 수가 PAGE_SIZE보다 작으면, 현재가 마지막 페이지인 것이므로 더 이상 페이지를 가져오지 않음
      if (lastPage.length < PAGE_SIZE) return undefined;

      return allPages.length;
    },
  });
}
