import { BUCKET_NAME } from "@/lib/constants";
import supabase from "@/lib/supabase";

export async function uploadImage({
  file,
  filePath,
}: {
  file: File;
  filePath: string;
}) {
  // 이미지 업로드
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (error) throw error;

  // 업로드된 이미지의 공개 URL 가져오기
  const {
    data: { publicUrl },
  } = await supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  return publicUrl;
}
