import { useQuery } from "@tanstack/react-query";

import { fetchPostById } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";

export default function usePostByIdData({
  postId,
  type,
}: {
  postId: number;
  type: "FEED" | "DETAIL";
}) {
  // enabled가 false일 때는 queryFn이 실행되지 않기 때문에 useInfinitePostsData에서 캐싱한 데이터를 사용함.
  // enabled가 true일 때는 queryFn이 실행되어 데이터를 불러옴
  return useQuery({
    queryKey: QUERY_KEYS.post.byId(postId),
    queryFn: () => fetchPostById(postId),
    enabled: type === "FEED" ? false : true,
  });
}
