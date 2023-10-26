const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const database = require('../database/database')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const users = [
  { username: 'user1', password: 'pass1' },
  { username: 'user2', password: 'pass2' }
];

app.post('/loginForm', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Missing username or password');
  }

  if (username.length > 20 || password.length > 20) {
    return res.status(400).send('Username or password too long');
  }

  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).send('Invalid username or password');
  }

  res.send('Login successful');
});

app.listen(3000, () => console.log('Server running on port 3000'));
