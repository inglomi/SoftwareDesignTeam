const express = require('express')
const app = express()
const router = express.Router();
const path = require("path");
const db = require('../database_connection');
const bodyParser = require('body-parser');

const { body, validationResult, expressValidator } = require('express-validator');

app.use(express.urlencoded({ extended: false}));
router.use(bodyParser.urlencoded({ extended: true}));

router.get("/register", (req, res) => {
	const filePath = path.join(__dirname, '../views/registration.html')
	res.sendFile(filePath);
});

const registrationValidationRules = [ 
	body('username', 'Username field cannot be empty.').notEmpty(),
	body('password', 'Password field cannot be empty.').notEmpty(),
    body('username', 'Username must be between 4-15 characters long.').isLength({ min: 4, max: 15 }),
    body('password', 'Password must be between 8-100 characters long.').isLength({ min: 8, max: 100 }),
	body("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
]

router.post("/register", registrationValidationRules, (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

	if (req.body.password !== req.body.confirmpassword) {
        return res.status(400).json({ message: 'Passwords do not match, please try again.' });
    }
	
	username= req.body.username;
	password = req.body.password;

	const query = "INSERT INTO UserCredentials (username, password) VALUES (?, ?)";
	const values = [username, password]

	db.query(query, values, (error, results) => {
		if (error) {
			console.error('Database error: ', error);
			res.status(500).send('Database error');
		}
		else {
			res.send('Registration Complete');
		}
	});
});

module.exports = router;