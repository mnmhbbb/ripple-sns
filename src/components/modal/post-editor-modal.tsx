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
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import { generateErrorMessage } from "@/lib/error";
import { usePostEditorModal } from "@/store/post-editor-modal";
import { useSession } from "@/store/session";

type Image = {
  file: File;
  previewUrl: string;
};

export default function PostEditorModal() {
  const session = useSession();

  const { isOpen, close } = usePostEditorModal();
  const { mutate: createPost, isPending: isCreatingPostPending } =
    useCreatePost({
      onSuccess: () => {
        close();
      },
      onError: (error) => {
        const message = generateErrorMessage(error);
        toast.error(message, {
          position: "top-center",
        });
      },
    });

  const [content, setContent] = useState("");
  const [images, setImages] = useState<Image[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCloseModal = () => {
    close();
  };

  const handleCreatePostClick = () => {
    if (content.trim() === "") return;
    createPost({
      content,
      images: images.map((image) => image.file),
      userId: session!.user?.id, // 타입단언
    });
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
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  useEffect(() => {
    if (!isOpen) return;
    textareaRef.current?.focus();
    setContent("");
    setImages([]);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-h-[90vh]">
        <DialogTitle>포스트 작성</DialogTitle>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="max-h-125 min-h-25"
          placeholder="무슨 일이 일어나고 있나요?"
          disabled={isCreatingPostPending}
        />
        <input
          onChange={handleSelectImages}
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept="image/*"
          multiple
        />
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
        <Button
          variant={"outline"}
          className="cursor-pointer"
          disabled={isCreatingPostPending}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon />
          이미지 추가
        </Button>
        <Button
          className="cursor-pointer"
          onClick={handleCreatePostClick}
          disabled={isCreatingPostPending}
        >
          저장
        </Button>
      </DialogContent>
    </Dialog>
  );
}
