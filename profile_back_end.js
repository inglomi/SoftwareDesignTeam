const express = require('express');
const port = 3000;
const server = express();
module.exports = server;
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static('src'));

let userProfile = {
  firstName: 'Viet',
  lastName: 'Pham',
  address1: '123 street',
  address2: 'optional',
  city: 'Houston',
  state: 'Texas',
  zipcode: '77004'
};

let userPassword = {
  currentPass: 'aaaaaaaaaaaaa!',
  newPass: 'bbbbbbbbbbbbbb!'
};

server.get('/profile', (req, res) => {
  res.sendFile(__dirname + '/src/profile.html');
});

server.post('/profile_saved', (req, res) => {
  const { firstName, lastName, address1, address2, city, state, zipcode } = req.body;
  userProfile = { firstName, lastName, address1, address2, city, state, zipcode };
  res.send('Your profile has been updated!');
});

server.post('/password_reset', (req, res) => {
  const { currentPass, newPass } = req.body;
  userPassword = { currentPass, newPass };
  res.send('Your password has been updated!');
});

server.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});

