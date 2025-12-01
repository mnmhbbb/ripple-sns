import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import useDeletePost from "@/hooks/mutations/post/use-delete-post";
import { useOpenAlertModal } from "@/store/alert-modal";

export default function DeletePostButton({ id }: { id: number }) {
  const navigate = useNavigate();

  const openAlertModal = useOpenAlertModal();
  const { mutate: deletePost, isPending: isDeletePostPending } = useDeletePost({
    onSuccess: () => {
      // 포스트 상세 페이지에서 삭제 시 메인 페이지로 이동
      const pathname = window.location.pathname;
      if (pathname.startsWith(`/post/${id}`)) {
        navigate("/", { replace: true });
      }
    },
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
