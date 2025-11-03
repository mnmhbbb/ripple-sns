import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTodo } from "@/api/update-todo";
import { QUERY_KEYS } from "@/lib/constants";
import type { Todo } from "@/types";

export function useUpdateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onMutate: async (updatedTodo) => {
      // 낙관적 업데이트 전, 데이터 요청이 있다면 취소
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.todo.detail(updatedTodo.id),
      });

      // 업데이트 이전의 캐시 데이터
      const prevTodo = queryClient.getQueryData<Todo>(
        QUERY_KEYS.todo.detail(updatedTodo.id),
      );

      // 개별 캐시 데이터 업데이트
      queryClient.setQueryData<Todo>(
        QUERY_KEYS.todo.detail(updatedTodo.id),
        (prevTodo) => {
          if (!prevTodo) return; // 이전 데이터가 없다면 캐시 데이터를 업데이트 하지 않음
          return { ...prevTodo, ...updatedTodo };
        },
      );

      // 낙관적 업데이트 실패 시, 이전 데이터로 롤백
      return { prevTodo };
    },
    onError: (_error, _variable, context) => {
      if (context && context.prevTodo) {
        queryClient.setQueryData<Todo>(
          QUERY_KEYS.todo.detail(context.prevTodo.id),
          context.prevTodo,
        );
      }
    },
  });
}
