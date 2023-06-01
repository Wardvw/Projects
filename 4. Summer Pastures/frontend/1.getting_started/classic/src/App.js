import React, { useState, useEffect } from "react";
import "./App.css";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [sortBy, setSortBy] = useState("creationDate"); //default sorting style is "alphabetical"
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
      id: Date.now(), // Assign unique ID to each todo item
      text: event.target.elements.todo.value,
      completed: false, // set default state of completed to false
      createdAt: new Date().toLocaleString(),
    };
    setTodos([...todos, newTodo]);
    event.target.elements.todo.value = "";
  };

  const handleSortBy = () => {
    if (sortBy === "completed") {
      setSortBy("alphabetical");
    } else if (sortBy === "alphabetical") {
      setSortBy("creationDate");
    } else {
      setSortBy("completed");
    }
  };

  const handleSortingButtonTitle = () => {
    if (sortBy === "completed") { 
      return "Not completed"}
    else if (sortBy === "alphabetical") { 
      return "Alphabetical" 
    }  
    else {
      return "Creation Date"
    }
  };

  const sortTodo = () => {
    let sortedTodos;
    if (sortBy === "completed") {
      sortedTodos = [...todos].sort((a, b) => a.completed - b.completed);
    } else if (sortBy === "alphabetical") {
      sortedTodos = [...todos].sort((a, b) => a.text.localeCompare(b.text));
    } else if (sortBy === "creationDate") {
      sortedTodos = [...todos].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else {
      sortedTodos = todos;
    }
    return sortedTodos
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
    newTodos[index].text = event.target.elements.updatedTodo.value;
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
    newTodos[index].completed = !newTodos[index].completed; // toggle the value of completed property
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
        <input className="input" type="text" name="todo" placeholder="add Todo"/>
        <button className = "addButton" type="submit">Add</button>
      </form>
      <div className="sortButtonContainer">
        <button className="sortButton" onClick={() => {handleSortBy()}}>
          Sorting by: {handleSortingButtonTitle()}
        </button>
      </div>
      <ul>
        {sortTodo().map((todo, index) => (
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