const express = require('express')
const app = express()
const router = express.Router();
const path = require("path");
const db = require('../database_connection');
const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// require('dovenv').config();


app.use(express.urlencoded({ extended: false}));
router.use(bodyParser.urlencoded({ extended: true}));

router.get("/login", (req, res) => {
	const filePath = path.join(__dirname, '../views/login.html')
	res.sendFile(filePath);
});

// router.post("/login", (req, res) => {
// 	const {}
// })

module.exports = router;