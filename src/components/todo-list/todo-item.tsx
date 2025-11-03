import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { useDeleteTodoMutation } from "@/hooks/mutations/use-delete-todo-mutation";
import { useUpdateTodoMutation } from "@/hooks/mutations/use-update-todo-mutation";
import { useTodoByIdData } from "@/hooks/queries/use-todo-by-id-data";

export default function TodoItem({ id }: { id: string }) {
  const { data: todo } = useTodoByIdData(id, "LIST");
  if (!todo) throw new Error("Todo not found");
  const { content, isDone } = todo;

  const { mutate: updateTodo } = useUpdateTodoMutation();
  const { mutate: deleteTodo, isPending: isDeleteTodoPending } =
    useDeleteTodoMutation();

  const handleDeleteClick = () => {
    deleteTodo(id);
  };

  const handleUpdateClick = () => {
    updateTodo({ id, isDone: !isDone });
  };

  return (
    <div className="flex items-center justify-between border p-2">
      <div className="flex items-center gap-5">
        <input
          type="checkbox"
          checked={isDone}
          onChange={handleUpdateClick}
          disabled={isDeleteTodoPending}
        />
        <Link to={`/todolist/${id}`}>{content}</Link>
      </div>
      <Button
        onClick={handleDeleteClick}
        variant={"destructive"}
        disabled={isDeleteTodoPending}
      >
        삭제
      </Button>
    </div>
  );
}
