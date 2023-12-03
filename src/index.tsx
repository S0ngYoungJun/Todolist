import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './styles/TodoList.scss';

const App: React.FC = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch('/api/todos')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      {todos.length === 0 ? (
        <p>No todos found.</p>
      ) : (
        <ul>
          {todos.map((todo: any) => (
            <li key={todo.id}>
              <span>{todo.title}</span>
              <button>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));