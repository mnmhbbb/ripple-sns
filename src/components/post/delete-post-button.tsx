import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useDeletePost } from "@/hooks/mutations/post/use-delete-post";
import { useOpenAlertModal } from "@/store/alert-modal";

export default function DeletePostButton({ id }: { id: number }) {
  const openAlertModal = useOpenAlertModal();
  const { mutate: deletePost, isPending: isDeletePostPending } = useDeletePost({
    onError: () => {
      toast.error("포스트 삭제에 실패했습니다.", {
        position: "top-center",
      });
    },
  });

  const handleDeleteClick = () => {
    openAlertModal({
      title: "포스트 삭제",
      description: "정말 게시글을 삭제하시겠습니까?",
      onPositive: () => {
        deletePost(id);
      },
    });
  };

  return (
    <Button
      className="cursor-pointer"
      variant={"ghost"}
      onClick={handleDeleteClick}
      disabled={isDeletePostPending}
    >
      삭제
    </Button>
  );
}
