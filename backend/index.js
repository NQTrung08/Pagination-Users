const express = require('express');
var cors = require('cors')
const mysql = require('mysql');
const app = express();
const port = 8080;

app.use(cors({origin: '*'}))
app.use(express.json())
// connect db
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'travel_db'
  });
  
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database: ' + err.stack);
      return;
    }
    console.log('Connected to database as id ' + connection.threadId);
  });

// router
app.get('/api/users/', (req, res) => {
  let page = req.query.page ? parseInt(req.query.page) : 1; // current page = 1
  let limit = req.query.limit ? parseInt(req.query.limit) : 8; // per page =  8
  let offset = (page - 1) * limit; // start 

  const query = `SELECT * FROM user LIMIT ${limit} OFFSET ${offset}`;

  connection.query(query, (error, results) => {
      if (error) {
          res.status(500).json({ error: error.message });
          return;
      }

      console.log(results);
      // Đếm số lượng người dùng
      connection.query('SELECT COUNT(*) AS totalCount FROM user', (error, countResult) => {
          if (error) {
              res.status(500).json({ error: error.message });
              return;
          }
          console.log(countResult);
          const totalCount = countResult[0].totalCount;
          const totalPages = Math.ceil(totalCount / limit);

          
          res.json({
              total: totalCount,
              totalPages: totalPages,
              currentPage: page,
              pageSize: limit,
              users: results,
          });
      });
  });
});


app.delete('/api/users/delete', (req, res) => {
  const { ids } = req.body; // Lấy danh sách các ID người dùng

  // Kiểm tra nếu không có ID
  if (!ids || ids.length === 0) {
    return res.status(400).json({ error: 'No user IDs provided' });
  }
  
  const query = `DELETE FROM user WHERE id IN (${ids.join(',')})`;

  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    console.log(results);
    // số lượng bản ghi bị xóa
    res.json({ deletedCount: results.affectedRows });
  });
});


// Chạy máy chủ
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});













