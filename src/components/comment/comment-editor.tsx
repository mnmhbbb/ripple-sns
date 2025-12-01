import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useCreateComment from "@/hooks/mutations/comment/use-create-comment";

export default function CommentEditor({ postId }: { postId: number }) {
  const { mutate: createComment, isPending: isCreatingCommentPending } =
    useCreateComment({
      onSuccess: () => {
        setContent("");
      },
      onError: () => {
        toast.error("댓글 작성에 실패했습니다.", {
          position: "top-center",
        });
      },
    });

  const [content, setContent] = useState("");

  const handleSubmitClick = () => {
    if (content.trim() === "") return;

    createComment({
      content,
      postId: postId,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isCreatingCommentPending}
      />
      <div className="flex justify-end">
        <Button onClick={handleSubmitClick} disabled={isCreatingCommentPending}>
          작성
        </Button>
      </div>
    </div>
  );
}
