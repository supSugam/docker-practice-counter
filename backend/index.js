const mysql = require('mysql2');
const express = require('express');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
const port = 3000;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.get('/api/count', (req, res) => {
  connection.query('SELECT count FROM counter WHERE id = 1', (err, results) => {
    if (err) throw err;
    res.status(200).json({ count: results[0].count });
  });
});

app.post('/api/increment', (req, res) => {
  connection.query(
    'UPDATE counter SET count = count + 1 WHERE id = 1',
    (err) => {
      if (err) throw err;
      res.status(200).json({ status: 'success' });
    }
  );
});

app.post('/api/decrement', (req, res) => {
  connection.query(
    'UPDATE counter SET count = count - 1 WHERE id = 1',
    (err) => {
      if (err) throw err;
      res.status(200).json({ status: 'success' });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
