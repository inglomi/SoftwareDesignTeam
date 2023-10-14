const express = require('express');
const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('src'));

app.get('/profile', (req, res) => {
  res.sendFile(__dirname + '/src/profile.html');
});

app.post('/profile_saved', (req, res) => {
  const { firstName, lastName, address1, address2, city, state, zipcode} = req.body;
  const userProfile = {
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zipcode
  };
  res.send('Your profile has been updated!');
});

app.post('/password_reset', (req, res) => {
  const {currentPass, newPass, confirmPass} = req.body;

  const userPassword = {
    currentPass,
    newPass,
    confirmPass
  }
  
  res.send('Your password has been updated!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
