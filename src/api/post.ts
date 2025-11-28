import { uploadImage } from "@/api/image";
import supabase from "@/lib/supabase";
import type { PostEntity } from "@/types";

export async function fetchPosts({ from, to }: { from: number; to: number }) {
  const { data, error } = await supabase
    .from("post")
    .select("*, author: profile!author_id (*)") // author 컬럼에 profile.author_id와 일치하는 모든 행을 가져옴
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return data;
}

export async function createPost(content: string) {
  const { data, error } = await supabase
    .from("post")
    .insert({ content })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const createPostWithImages = async ({
  content,
  images,
  userId,
}: {
  content: string;
  images: File[];
  userId: string;
}) => {
  // 1. 새로운 포스트 생성
  const post = await createPost(content);

  // 이미지가 없으면 그대로 포스트 반환
  if (images.length === 0) return post;

  try {
    // 2. 이미지 업로드
    // images.map은 [Promise<string>, Promise<string>, ...] 형태의 배열을 반환하고,
    // 이 Promise 배열이 Promise.all()에 전달되어 모든 Promise를 병렬로 실행함.
    // 모든 Promise가 resolve될 때까지 기다린 후, 업로드된 이미지의 URL 배열이 imageUrls에 담기게 됨
    const imageUrls = await Promise.all(
      images.map((image) => {
        const fileExtension = image.name.split(".").pop();
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
        const filePath = `${userId}/${post.id}/${fileName}`;

        return uploadImage({ file: image, filePath });
      }),
    );

    // 3. 포스트 테이블 업데이트
    const updatedPost = await updatePost({
      id: post.id,
      image_urls: imageUrls,
    });

    // 최종 완성된 포스트 데이터 반환
    return updatedPost;
  } catch (error) {
    // 과정 중 에러가 발생하면 포스트 삭제
    await deletePost(post.id);
    throw error;
  }
};

export async function updatePost(post: Partial<PostEntity> & { id: number }) {
  const { data, error } = await supabase
    .from("post")
    .update(post)
    .eq("id", post.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 포스트 삭제
export async function deletePost(id: number) {
  const { data, error } = await supabase
    .from("post")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
