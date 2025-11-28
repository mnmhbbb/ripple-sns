import { PlusCircleIcon } from "lucide-react";

import { useOpenCreatePostModal } from "@/store/post-editor-modal";

export default function CreatePostButton() {
  const openCreatePostModal = useOpenCreatePostModal();

  return (
    <div
      className="bg-muted text-muted-foreground cursor-pointer rounded-lg p-2"
      onClick={openCreatePostModal}
    >
      <div className="flex items-center justify-between gap-2">
        <div>나누고싶은 이야기가 있나요?</div>
        <div>
          <PlusCircleIcon className="size-5" />
        </div>
      </div>
    </div>
  );
}
