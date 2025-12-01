import Fallback from "../fallback";
import Loader from "../loader";

import CommentItem from "@/components/comment/comment-item";
import useCommentsData from "@/hooks/queries/use-comments-data";

export default function CommentList({ postId }: { postId: number }) {
  const {
    data: comments,
    error: fetchCommentsError,
    isPending: isFetchingCommentsPending,
  } = useCommentsData(postId);

  if (isFetchingCommentsPending) return <Loader />;
  if (fetchCommentsError) return <Fallback />;

  return (
    <div className="flex flex-col gap-5">
      {comments?.map((comment) => (
        <CommentItem key={comment.id} {...comment} />
      ))}
    </div>
  );
}
