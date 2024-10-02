const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '7777',
  database: 'teste'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL');
  }
});

// Rota para autenticação de login
app.post('/login', (req, res) => {
  
  const { email, senha } = req.body;

  const query = 'SELECT * FROM USUARIOS WHERE email = ? AND senha = ?';
  db.query(query, [email, senha], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (results.length > 0) {
      res.status(200).json({ message: 'Login bem-sucedido', user: results[0] });
    } else {
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  });
});

// Rota para cadastro de usuários
app.post('/cadastro', (req, res) => {
  const { email, senha, nome } = req.body;

  const query = 'INSERT INTO USUARIOS (email, senha, nome) VALUES (?, ?, ?)';
  db.query(query, [email, senha, nome], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    res.status(200).json({ message: 'Usuário cadastrado com sucesso!' });
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
