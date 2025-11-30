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

// 특정 경로 밑에 있는 모든 이미지 삭제
// 현재 이미지 파일을 user_id/post_id/이미지 위치에 저장하기 때문
export async function deleteImagesInPath(path: string) {
  // 1. 특정 경로 밑에 있는 모든 이미지 목록 가져오기
  const { data: files, error: fetchFilesError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(path);
  if (fetchFilesError) throw fetchFilesError;

  // 만약 해당 경로에 이미지가 없으면 종료
  if (!files || files.length === 0) return;

  // 2. 이미지 삭제
  const { error: removeError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(files.map((file) => `${path}/${file.name}`));

  if (removeError) throw removeError;
}
