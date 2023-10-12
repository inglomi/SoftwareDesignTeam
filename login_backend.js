const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// parses POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const users = [
  { username: 'user1', password: 'pass1' },
  { username: 'user2', password: 'pass2' }
];

// POST /login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // validate input
  if (!username || !password) {
    return res.status(400).send('Missing username or password');
  }

  if (username.length > 20 || password.length > 20) {
    return res.status(400).send('Username or password too long');
  }

  // check if user exists
  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).send('Invalid username or password');
  }

  // user logged in successfully
  res.send('Login successful');
});

app.listen(3000, () => console.log('Server running on port 3000'));
