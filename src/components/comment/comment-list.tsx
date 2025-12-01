import CommentItem from "@/components/comment/comment-item";
import Fallback from "@/components/fallback";
import Loader from "@/components/loader";
import useCommentsData from "@/hooks/queries/use-comments-data";
import type { Comment, NestedComment } from "@/types";

function toNestedComment(comments?: Comment[]): NestedComment[] {
  const result: NestedComment[] = [];

  comments?.forEach((comment) => {
    if (!comment.parent_comment_id) {
      result.push({ ...comment, children: [] });
    } else {
      const parentCommentIndex = result.findIndex(
        (c) => c.id === comment.parent_comment_id,
      );
      result[parentCommentIndex].children.push({
        ...comment,
        children: [],
        parentComment: result[parentCommentIndex],
      });
    }
  });

  return result;
}

export default function CommentList({ postId }: { postId: number }) {
  const {
    data: comments,
    error: fetchCommentsError,
    isPending: isFetchingCommentsPending,
  } = useCommentsData(postId);

  if (isFetchingCommentsPending) return <Loader />;
  if (fetchCommentsError) return <Fallback />;

  const nestedComments = toNestedComment(comments);

  return (
    <div className="flex flex-col gap-5">
      {nestedComments?.map((comment) => (
        <CommentItem key={comment.id} {...comment} />
      ))}
    </div>
  );
}
