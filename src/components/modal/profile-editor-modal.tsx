import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import defaultAvatar from "@/assets/default-avatar.jpg";
import Fallback from "@/components/fallback";
import Loader from "@/components/loader";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUpdateProfile from "@/hooks/mutations/profile/use-update-profile";
import useProfileData from "@/hooks/queries/use-profile-data";
import { useProfileEditorModal } from "@/store/profile-editor-modal";
import { useSession } from "@/store/session";

type Image = {
  file: File;
  previewUrl: string;
};

export default function ProfileEditorModal() {
  const session = useSession();

  const {
    data: profile,
    error: fetchProfileError,
    isPending: isFetchProfilePending,
  } = useProfileData(session?.user.id);

  const {
    isOpen,
    actions: { close },
  } = useProfileEditorModal();

  const { mutate: updateProfile, isPending: isUpdateProfilePending } =
    useUpdateProfile({
      onSuccess: () => {
        close();
      },
      onError: () => {
        toast.error("프로필 수정에 실패하였습니다", {
          position: "top-center",
        });
      },
    });

  const [avatarImage, setAvatarImage] = useState<Image | null>(null);
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 모달 닫힐 때 이미지 URL 제거(메모리 누수 방지)
  useEffect(() => {
    if (!isOpen && avatarImage) {
      URL.revokeObjectURL(avatarImage.previewUrl);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && profile) {
      setNickname(profile.nickname);
      setBio(profile.bio);
      setAvatarImage(null); // 여기는 앞으로 새로 선택할 이미지만 저장하는 용이기 때문에 null
    }
  }, [profile, isOpen]);

  const handleAvatarImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    // 기존 이미지 URL 제거(메모리 누수 방지)
    if (avatarImage) {
      URL.revokeObjectURL(avatarImage.previewUrl);
    }

    setAvatarImage({
      file,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const handleUpdateClick = () => {
    if (nickname.trim() === "") return;
    updateProfile({
      userId: session!.user.id, // 타입 단언
      bio,
      nickname,
      avatarImageFile: avatarImage?.file,
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={close}>
      <AlertDialogContent className="flex flex-col gap-5">
        <AlertDialogHeader>
          <AlertDialogTitle>프로필 수정하기</AlertDialogTitle>
          {fetchProfileError && <Fallback />}
          {isFetchProfilePending && <Loader />}
          {!fetchProfileError && !isFetchProfilePending && (
            <>
              <div className="flex flex-col gap-2">
                <div className="text-muted-foreground">프로필 이미지</div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleAvatarImage}
                  disabled={isUpdateProfilePending}
                />
                <img
                  src={
                    avatarImage?.previewUrl ||
                    profile.avatar_url ||
                    defaultAvatar
                  }
                  alt={`${profile.nickname}의 프로필 이미지`}
                  className="h-20 w-20 cursor-pointer rounded-full object-cover"
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current?.click();
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-muted-foreground">닉네임</div>
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  disabled={isUpdateProfilePending}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-muted-foreground">소개</div>
                <Input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={isUpdateProfilePending}
                />
              </div>

              <Button
                className="cursor-pointer"
                onClick={handleUpdateClick}
                disabled={isUpdateProfilePending}
              >
                수정하기
              </Button>
            </>
          )}
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
