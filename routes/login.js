const express = require('express')
const app = express()
const router = express.Router();
const path = require("path");
const db = require('../database_connection');
const bodyParser = require('body-parser');

const { body, validationResult, expressValidator } = require('express-validator');
const passport = require('passport');

//Authentication Packages
// const session = require('express-session');


app.use(express.urlencoded({ extended: false}));
router.use(bodyParser.urlencoded({ extended: true}));

// app.use(session({
// 	secret: 'keyboard cat',
// 	resave: false,
// 	saveUninitialized: true,
// 	// cookie: { secure: true }
//   }))

router.get("/login", (req, res) => {
	const filePath = path.join(__dirname, '../views/login.html')
	res.sendFile(filePath);
});

router.post("/login", passport.authenticate(
	'local', {
		successRedirect: '/profile',
		failureRedirect: '/login'
	})
);

router.get('/logout', function(req, res, next) {
	req.logout(function(err) {
	  if (err) { return next(err); }
	  req.session.destroy();
	  res.redirect('/');
	});
});

// router.post("/login", (req, res) => {
// 	const {}
// })

module.exports = router;