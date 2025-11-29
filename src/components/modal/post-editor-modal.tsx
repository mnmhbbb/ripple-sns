import { ImageIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import useCreatePost from "@/hooks/mutations/post/use-create-post";
import useUpdatePost from "@/hooks/mutations/post/use-update-post";
import { generateErrorMessage } from "@/lib/error";
import { useOpenAlertModal } from "@/store/alert-modal";
import { usePostEditorModal } from "@/store/post-editor-modal";
import { useSession } from "@/store/session";

type Image = {
  file: File;
  previewUrl: string;
};

export default function PostEditorModal() {
  const session = useSession();
  const postEditorModal = usePostEditorModal();
  const openAlertModal = useOpenAlertModal();

  const { mutate: createPost, isPending: isCreatingPostPending } =
    useCreatePost({
      onSuccess: () => {
        postEditorModal.actions.close();
      },
      onError: (error) => {
        const message = generateErrorMessage(error);
        toast.error(message, {
          position: "top-center",
        });
      },
    });

  const { mutate: updatePost, isPending: isUpdatingPostPending } =
    useUpdatePost({
      onSuccess: () => {
        postEditorModal.actions.close();
      },
      onError: () => {
        toast.error("포스트 수정에 실패했습니다.", {
          position: "top-center",
        });
      },
    });

  const [content, setContent] = useState("");
  const [images, setImages] = useState<Image[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  useEffect(() => {
    if (!postEditorModal.isOpen) {
      images.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
      return;
    }

    if (postEditorModal.type === "CREATE") {
      setContent("");
      setImages([]);
    } else {
      setContent(postEditorModal.content);
      setImages([]); // 컨텐츠만 수정 가능하다는 정책
      return;
    }

    textareaRef.current?.focus();
    setContent("");
    setImages([]);
  }, [postEditorModal.isOpen]);

  const handleCloseModal = () => {
    if (content !== "" || images.length !== 0) {
      openAlertModal({
        title: "게시글 작성이 마무리 되지 않았습니다",
        description: "작성 중인 내용이 있습니다. 정말 닫으시겠습니까?",
        onPositive: () => {
          postEditorModal.actions.close();
        },
      });
      return;
    }
    postEditorModal.actions.close();
  };

  const handleSavePostClick = () => {
    if (content.trim() === "") return;
    if (!postEditorModal.isOpen) return;

    if (postEditorModal.type === "CREATE") {
      createPost({
        content,
        images: images.map((image) => image.file),
        userId: session!.user?.id, // 타입단언
      });
    } else {
      // 변동사항 없을 경우 리턴
      if (content === postEditorModal.content) return;
      updatePost({
        id: postEditorModal.postId,
        content,
      });
    }
  };

  const handleSelectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        const previewUrl = URL.createObjectURL(file);
        setImages((prev) => [...prev, { file, previewUrl }]);
      });
    }

    e.target.value = ""; // 파일 선택 후 값 초기화(2번 이상 업로드할 때 감지 못하는 버그 방지)
  };

  const handleDeleteImage = (image: Image) => {
    setImages((prev) => prev.filter((i) => i.previewUrl !== image.previewUrl));
    URL.revokeObjectURL(image.previewUrl);
  };

  const isPending = isCreatingPostPending || isUpdatingPostPending;

  return (
    <Dialog open={postEditorModal.isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-h-[90vh]">
        <DialogTitle>포스트 작성</DialogTitle>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="max-h-125 min-h-25"
          placeholder="무슨 일이 일어나고 있나요?"
          disabled={isPending}
        />
        <input
          onChange={handleSelectImages}
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept="image/*"
          multiple
        />
        {/* 수정 모달 */}
        {postEditorModal.isOpen && postEditorModal.type === "EDIT" && (
          <Carousel>
            <CarouselContent>
              {postEditorModal.imageUrls?.map((url) => (
                <CarouselItem className="basis-2/5" key={url}>
                  <div className="relative">
                    <img
                      src={url}
                      className="h-full w-full rounded-sm object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}

        {/* 생성 모달 */}
        {images.length > 0 && (
          <Carousel>
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem className="basis-2/5" key={image.previewUrl}>
                  <div className="relative">
                    <img
                      src={image.previewUrl}
                      className="h-full w-full rounded-sm object-cover"
                    />
                    <div
                      onClick={() => handleDeleteImage(image)}
                      className="absolute top-0 right-0 m-1 cursor-pointer rounded-full bg-black/30 p-1"
                    >
                      <XIcon className="size-4 text-white" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
        {postEditorModal.isOpen && postEditorModal.type === "CREATE" && (
          <Button
            variant={"outline"}
            className="cursor-pointer"
            disabled={isCreatingPostPending}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon />
            이미지 추가
          </Button>
        )}
        <Button
          className="cursor-pointer"
          onClick={handleSavePostClick}
          disabled={isPending}
        >
          저장
        </Button>
      </DialogContent>
    </Dialog>
  );
}
