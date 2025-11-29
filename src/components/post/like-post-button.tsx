import { HeartIcon } from "lucide-react";
import { toast } from "sonner";

import useTogglePostLike from "@/hooks/mutations/post/use-toggle-post-like";
import { useSession } from "@/store/session";

export default function LikePostButton({
  id,
  likeCount,
  isLiked,
}: {
  id: number;
  likeCount: number;
  isLiked: boolean;
}) {
  const session = useSession();
  const userId = session!.user.id;

  const { mutate: togglePostLike } = useTogglePostLike({
    onError: () => {
      toast.error("좋아요에 실패했습니다.", {
        position: "top-center",
      });
    },
  });

  const handleLikeClick = () => {
    togglePostLike({ postId: id, userId: userId });
  };

  return (
    <div
      className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-xl border p-2 px-4 text-sm"
      onClick={handleLikeClick}
    >
      <HeartIcon
        className={`h-4 w-4 ${isLiked && "fill-foreground border-foreground"}`}
      />
      <span>{likeCount}</span>
    </div>
  );
}
