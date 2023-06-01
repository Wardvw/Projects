import React, { useState, useEffect } from "react";
import "./App.css";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [editableTodoIndex, setEditableTodoIndex] = useState(-1);

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos"));
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (event) => {
    event.preventDefault();
    const newTodo = {
      id: Date.now(),
      text: event.target.elements.todo.value,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };
    setTodos([...todos, newTodo]);
    event.target.elements.todo.value = "";
  };

  const renderTodoContent = (index, todo) => {
    if (editableTodoIndex === index) {
      return (
        <form onSubmit={(event) => handleUpdateTodo(event, index)}>
          <input
            className="updateInput"
            type="text"
            placeholder="Update Todo"
            defaultValue={todo.text}
            autoFocus
            onFocus={(event) => event.target.select()}
            onBlur={() => setEditableTodoIndex(-1)}
          />
        </form>
      );
    } else {
      return (
        renderTodoItem(index, todo)
      );
    }
  };

  const renderTodoItem = (index, todo) => {
    if (editableTodoIndex === index) {
      return null; // Or any other JSX you want to render in this case
    }
    let className = "todo";
    if (todo.completed) {
      className += "Complete";
    }
    const handleClick = () => {
      handleTodoClick(index);
    };
    return (
      <div className={className} onClick={handleClick}>
        <div className="todo-text">{todo.text}</div>
        <div className="todo-date">{todo.createdAt}</div>
      </div>
    );
  };

  const handleTodoClick = (index) => {
    setEditableTodoIndex(index);
  };

  const deleteTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const handleUpdateTodo = (event, index) => {
    event.preventDefault();
    const newTodos = [...todos];
    const updatedTodoValue = event.target.elements[0].value; // Get the value from the form input correctly
    newTodos[index].text = updatedTodoValue;
    setTodos(newTodos);
    setEditableTodoIndex(-1);
  };


  const handleButtonClassName = (todo) => {
    let className = "completeButton";
    if (todo.completed) {
      className += "Completed";
    }
    return className;
  };

  const completeTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const handleCompleteButtonTitle = (todo) => {
    if (todo.completed === true) {
      return "Mark Incomplete";
    } else {
      return "Mark Complete";
    }
  };

  return (
    <>
      <h1>ToDo App</h1>
      <form onSubmit={addTodo}>
        <input className="input" type="text" name="todo" placeholder="add Todo" />
        <button className="addButton" type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {renderTodoContent(index, todo)}
            <div className="buttonDiv">
              <button className={handleButtonClassName(todo)} onClick={() => completeTodo(index)}>
                {handleCompleteButtonTitle(todo)}
              </button>
              <button className="deleteButton" onClick={() => deleteTodo(index)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Todo;
