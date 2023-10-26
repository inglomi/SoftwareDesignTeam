const express = require('express')
const app = express()
const router = express.Router();
const path = require("path");
const db = require('../database_connection');
const bodyParser = require('body-parser');


const { body, validationResult } = require('express-validator');

app.use(express.urlencoded({ extended: false}));
router.use(bodyParser.urlencoded({ extended: true}));


router.get("/quote", (req, res) => {
	const filePath = path.join(__dirname, '../views/quote.html')
	res.sendFile(filePath);
});

router.get("/data", (req, res) => {
	var query = 'SELECT addressOne, city, state, zipCode FROM user WHERE userID=1' //Replace WHERE userID=1 to actual log in user
	db.query(query, (error, results) => {
		if (error) {
			console.error('Database error: ', error);
			res.status(500).send('Database error');
		}
		else {
			const userAddress = results[0];
            res.json(userAddress);
		}
	})
});

router.post("/save__quote", [
  body('gallons').isFloat({ min: 0 }).withMessage('Gallons must be a positive number.'),
  body('deliveryDate').isAfter().withMessage('Please select a valid future date.'),
], (req,res) => {
	const gallons = req.body.gallons;
	const deliveryDate = req.body.deliveryDate;

	const query = "INSERT INTO quotes (userID, gallons, delivery) VALUES (1, ?, ?)";
	const values = [gallons, deliveryDate];

	console.log(values);

	db.query(query, values, (error, results) => {
		if (error) {
			console.error('Database error: ', error);
			res.status(500).send('Database error');
		}
		else {
			res.send('Data updated successfuly');
		}
	});
});

module.exports = router;