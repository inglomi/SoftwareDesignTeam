const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config')

const { body, validationResult, expressValidator } = require('express-validator');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//Authentication Packages
const session = require('express-session');
const passport = require('passport');
const MySQLStore = require('express-mysql-session')(session);

const options = {
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
}

const sessionStore = new MySQLStore(options);

app.use(session({
	secret: '8fa1dee245a27cc3c2e12c58634247df932b3582e79baa3f55430ce156999027c434b11e472681f1d134d932b42a37a45c8e394ce744dfa5ed475c2497990c23',
	resave: false,
  store: sessionStore,
	saveUninitialized: false,
	// cookie: { secure: true }
}))

app.use(passport.initialize());
app.use(passport.session());

// Import all route files
app.use(require('./routes/index'));
app.use(require('./routes/quoteform'));
app.use(require('./routes/login'));
app.use(require('./routes/registration'));
app.use(require('./routes/profile'));
app.use(require('./routes/history'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});