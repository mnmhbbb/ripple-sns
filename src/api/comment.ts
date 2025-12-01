import supabase from "@/lib/supabase";

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
