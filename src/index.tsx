import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './styles/TodoList.scss';

const App: React.FC = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetch('/api/todos')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const handleAddTodo = () => {
    // 요청을 통해 서버에 새로운 투두 추가
    fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTodo }),
    })
      .then(response => response.json())
      .then(data => {
        // 서버 응답을 받아와서 현재 투두 리스트 갱신
        setTodos([...todos, data]);
        setNewTodo(''); // 입력창 초기화
      })
      .catch(error => console.error('Error adding todo:', error));
  };

  const handleDeleteTodo = (id: string) => {
    // 요청을 통해 서버에 특정 투두 삭제
    fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        // 서버 응답을 받아와서 현재 투두 리스트 갱신
        const updatedTodos = todos.filter((todo: any) => todo.id !== id);
        setTodos(updatedTodos);
      })
      .catch(error => console.error('Error deleting todo:', error));
  };

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      <div>
        <input
          type="text"
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
        />
        <button onClick={handleAddTodo}>+</button>
      </div>
      {todos.length === 0 ? (
        <p>No todos found.</p>
      ) : (
        <ul>
          {todos.map((todo: any) => (
            <li key={todo.id}>
              <span>{todo.title}</span>
              <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));