const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mariadb = require('mariadb');

const app = express();
const port = 5000;

app.use(bodyParser.json());

// MariaDB 연결 설정
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '723546',
  database: 'todolist',
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

// 기본 라우터: / 에 대한 요청에 대한 응답
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});