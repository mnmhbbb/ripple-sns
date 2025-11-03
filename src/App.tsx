import "./App.css";
import { Route, Routes } from "react-router";

import IndexPage from "@/pages/index-page";
import TodoDetailPage from "@/pages/todo-detail-page";
import TodoListPage from "@/pages/todo-list-page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/todolist" element={<TodoListPage />} />
      <Route path="/todolist/:id" element={<TodoDetailPage />} />
    </Routes>
  );
}

export default App;
