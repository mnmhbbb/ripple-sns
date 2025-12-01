import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useCreateComment from "@/hooks/mutations/comment/use-create-comment";
import useUpdateComment from "@/hooks/mutations/comment/use-update-comment";

type CreateMode = {
  type: "CREATE";
  postId: number;
};

type EditMode = {
  type: "EDIT";
  commentId: number;
  initialContent: string;
  onClose: () => void; // 부모 컴포넌트인 CommentItem의 isEditing 상태를 false로 변경하기 위해
};

type ReplyMode = {
  type: "REPLY";
  postId: number;
  parentCommentId: number;
  rootCommentId: number;
  onClose: () => void;
};

type Props = CreateMode | EditMode | ReplyMode;

export default function CommentEditor(props: Props) {
  const { mutate: createComment, isPending: isCreateCommentPending } =
    useCreateComment({
      onSuccess: () => {
        setContent("");
        // 대댓글모드였다면 작성 성공 후 입력창 닫기
        if (props.type === "REPLY") {
          props.onClose();
        }
      },
      onError: () => {
        toast.error("댓글 작성에 실패했습니다.", {
          position: "top-center",
        });
      },
    });
  const { mutate: updateComment, isPending: isUpdateCommentPending } =
    useUpdateComment({
      onSuccess: () => {
        setContent("");
        (props as EditMode).onClose();
      },
      onError: () => {
        toast.error("댓글 수정에 실패했습니다.", {
          position: "top-center",
        });
      },
    });

  const [content, setContent] = useState("");

  useEffect(() => {
    if (props.type === "EDIT") {
      setContent(props.initialContent);
    }
  }, []);

  const handleSubmitClick = () => {
    if (content.trim() === "") return;

    if (props.type === "CREATE") {
      createComment({
        content,
        postId: props.postId,
      });
    } else if (props.type === "REPLY") {
      createComment({
        content,
        postId: props.postId,
        parentCommentId: props.parentCommentId,
        rootCommentId: props.rootCommentId,
      });
    } else {
      updateComment({
        id: props.commentId,
        content,
      });
    }
  };

  const isPending = isCreateCommentPending || isUpdateCommentPending;

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPending}
      />
      <div className="flex justify-end gap-2">
        {props.type === "EDIT" ||
          (props.type === "REPLY" && (
            <Button variant="outline" onClick={() => props.onClose()}>
              취소
            </Button>
          ))}
        <Button onClick={handleSubmitClick} disabled={isPending}>
          작성
        </Button>
      </div>
    </div>
  );
}
