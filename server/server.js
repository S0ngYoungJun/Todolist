const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mariadb = require('mariadb');

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MariaDB 연결 설정
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '723546',
  database: 'todolist',
  port:3307,
  connectionLimit: 5,
});

// 정적 파일 서빙을 위한 미들웨어 추가
app.use(express.static(path.join(__dirname, '../public')));

// API 엔드포인트: 할 일 목록 조회
app.get('/api/todos', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM todos');
    conn.release();
    res.json(result);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API 엔드포인트: 새로운 할 일 추가
app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('INSERT INTO todos (title) VALUES (?)', [title]);
    conn.release();

    const newTodoId = result.insertId.toString(); // BigInt를 문자열로 변환
    const newTodo = { id: newTodoId, title };

    res.json(newTodo);
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch('/api/todos/:id', async (req, res) => {
  const todoId = req.params.id;
  const { completed } = req.body;

  try {
    console.log('Received PATCH request. Todo ID:', todoId, 'Completed:', completed);

    const conn = await pool.getConnection();
    await conn.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, todoId]);
    conn.release();

    console.log('Todo updated successfully.');
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  const todoId = req.params.id;

  try {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM todos WHERE id = ?', [todoId]);
    conn.release();

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 기본 라우터: / 에 대한 요청에 대한 응답
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});