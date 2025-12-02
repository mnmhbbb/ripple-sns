import supabase from "@/lib/supabase";

export async function fetchComments(postId: number) {
  const { data, error } = await supabase
    .from("comment")
    .select("*, author: profile!author_id (*) ") // author 필드에 comment.author_id = profile.id 조건으로 조인한 profile 레코드를 중첩 객체로 가져옴(댓글에 프로필 정보를 가져와야 하기 때문)
    .eq("post_id", postId)
    .order("created_at");

  if (error) throw error;
  return data;
}

// 댓글 카운트 증가 RPC 함수 호출
export async function incrementCommentCount(postId: number) {
  const { error } = await supabase.rpc("increment_comment_count", {
    p_post_id: postId,
  });

  if (error) throw error;
}

// 댓글 개수 재계산 RPC 함수 호출 (삭제 후 실제 남은 댓글 개수로 업데이트)
export async function recalculateCommentCount(postId: number) {
  const { error } = await supabase.rpc("recalculate_comment_count", {
    p_post_id: postId,
  });

  if (error) throw error;
}

export async function createComment({
  content,
  postId,
  parentCommentId,
  rootCommentId,
}: {
  content: string;
  postId: number;
  parentCommentId?: number;
  rootCommentId?: number;
}) {
  const { data, error } = await supabase
    .from("comment")
    .insert({
      content,
      post_id: postId,
      parent_comment_id: parentCommentId,
      root_comment_id: rootCommentId,
    })
    .select()
    .single();

  if (error) throw error;

  // 댓글 생성 성공 시 comment_count 증가
  await incrementCommentCount(postId);

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

  // 삭제 후 실제 남은 댓글 개수로 재계산
  await recalculateCommentCount(data.post_id);

  return data;
}
