import { PlusCircleIcon } from "lucide-react";

import { useOpenPostEditorModal } from "@/store/post-editor-modal";

export default function CreatePostButton() {
  const openPostEditorModal = useOpenPostEditorModal();

  return (
    <div
      className="bg-muted text-muted-foreground cursor-pointer rounded-lg p-2"
      onClick={openPostEditorModal}
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
