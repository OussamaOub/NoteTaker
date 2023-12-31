import React, { useState } from "react";

export default function TodosLoader({
  todos,
  handleToggleTodo,
  handleDeleteTodo,
}) {
  const [newTodo, setNewTodo] = useState("");
  let count = todos.length + 1;




  return (
    <div className="todos-container">
      {todos.length === 0 ? (
        <div className="no-todos">No Tasks</div>
      ) : (
        todos.map((todo) => (
          <div
            className={`todo-card ${todo.isDone ? "done" : ""}`}
            key={todo.todoId}
          >
            <input
              type="checkbox"
              checked={todo.isDone}
              onChange={() => handleToggleTodo && handleToggleTodo(todo)}
            />

            <p>{todo.content}</p>
            <button
              className="delete-button"
              onClick={() => {
                handleDeleteTodo && handleDeleteTodo(todo);
              }}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))
      )}
    </div>
  );
}
