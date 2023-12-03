const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');

const app = express();
const port = 5000;

app.use(bodyParser.json());

// MariaDB 연결 설정
const pool = mariadb.createPool({
  host: 'your-database-host',
  user: 'your-database-user',
  password: 'your-database-password',
  database: 'your-database-name',
  connectionLimit: 5,
});

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});