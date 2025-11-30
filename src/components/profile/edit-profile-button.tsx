import { Button } from "@/components/ui/button";
import { useOpenProfileEditorModal } from "@/store/profile-editor-modal";

export default function EditProfileButton() {
  const open = useOpenProfileEditorModal();

  return (
    <Button variant={"secondary"} className="cursor-pointer" onClick={open}>
      프로필 수정
    </Button>
  );
}
