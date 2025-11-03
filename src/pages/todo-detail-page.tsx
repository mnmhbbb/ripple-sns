import { useParams } from "react-router";

import { useTodoByIdData } from "@/hooks/queries/use-todo-by-id-data";

export default function TodoDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useTodoByIdData(id ?? "");

  if (error) return <div>오류가 발생했습니다.</div>;
  if (isLoading) return <div>로딩 중 입니다 ...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">TodoDetailPage</h1>
      <p>{data?.content}</p>
    </div>
  );
}
