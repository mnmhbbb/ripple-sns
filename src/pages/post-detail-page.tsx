import { Navigate, useParams } from "react-router";

import PostItem from "@/components/post/post-item";

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.postId;

  if (!postId) return <Navigate to="/" />;

  return (
    <div>
      <PostItem postId={Number(postId)} type="DETAIL" />
    </div>
  );
}
