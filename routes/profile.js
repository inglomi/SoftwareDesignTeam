const express = require('express')
const app = express()
const router = express.Router();
const path = require("path");
const db = require('../database_connection');
const bodyParser = require('body-parser');

app.use(express.urlencoded({ extended: false}));
router.use(bodyParser.urlencoded({ extended: true}));

router.get("/profile", (req, res) => {
	const filePath = path.join(__dirname, '../views/profile.html')
	res.sendFile(filePath);
});

module.exports = router;