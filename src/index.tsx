import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './styles/TodoList.scss';

const App: React.FC = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/todos');
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
  
    // 컴포넌트가 마운트되었을 때와 함께 주기적으로 데이터를 가져옴
    const intervalId = setInterval(fetchData, 3000); // 5초마다 데이터를 가져옴
  
    // 컴포넌트가 언마운트되면 clearInterval을 통해 interval을 정리
    return () => clearInterval(intervalId);
  }, []); // 빈 의존성 배열

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

  const handleToggleTodo = (id: number) => {
    console.log('Toggling todo:', id);
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  
    // 토글된 completed 값을 서버에 업데이트
    fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !todos.find(todo => todo.id === id)?.completed }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(updatedTodo => {
        // 서버 응답을 받아와서 현재 투두 리스트 갱신
        console.log('Todo updated:', updatedTodo);
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
          )
        );
      })
      .catch(error => console.error('Error updating todo:', error));
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
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <span>{todo.title}</span>
              <label>
                <input
                 type="checkbox"
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                  />
                Complete
              </label>
              <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));