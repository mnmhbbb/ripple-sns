import supabase from "@/lib/supabase";

export async function fetchComments(postId: number) {
  const { data, error } = await supabase
    .from("comment")
    .select("*, author: profile!author_id (*) ") // author 필드에 comment.author_id = profile.id 조건으로 조인한 profile 레코드를 중첩 객체로 가져옴(댓글에 프로필 정보를 가져와야 하기 때문)
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createComment({
  content,
  postId,
}: {
  content: string;
  postId: number;
}) {
  const { data, error } = await supabase
    .from("comment")
    .insert({ content, post_id: postId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateComment({
  id,
  content,
}: {
  id: number;
  content: string;
}) {
  const { data, error } = await supabase
    .from("comment")
    .update({ content })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteComment(id: number) {
  const { data, error } = await supabase
    .from("comment")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
