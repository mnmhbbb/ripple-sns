import { useQuery } from "@tanstack/react-query";

import { fetchTodoById } from "@/api/fetch-todo-by-id";
import { QUERY_KEYS } from "@/lib/constants";

export function useTodoByIdData(id: string, type: "LIST" | "DETAIL") {
  return useQuery({
    queryFn: () => fetchTodoById(id),
    enabled: type === "DETAIL", // 상세 페이지에서만 fetch 요청
    queryKey: QUERY_KEYS.todo.detail(id),
  });
}
