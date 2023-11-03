const express = require('express')
const app = express()
const router = express.Router();
const path = require("path");
const db = require('../database_connection');
const bodyParser = require('body-parser');


const { body, validationResult } = require('express-validator');
const authenticationMiddleware = require('../modules/userAuth')

app.use(express.urlencoded({ extended: false}));
router.use(bodyParser.urlencoded({ extended: true}));

// Upon Get Request to /quote path, serve the quote page
router.get("/quote", authenticationMiddleware(), (req, res) => {
	const filePath = path.join(__dirname, '../views/quote.html')
	res.sendFile(filePath);
});

// Upon Get request to /data, retrieve and display the user address on the quote form
router.get("/data", (req, res) => {
	const userID = req.user.user_id;
	var query = 'SELECT addressOne, addressTwo, city, state, zipCode FROM ClientInformation WHERE userID=?'; //Replace WHERE userID=1 to actual log in user
	const values =[userID];
	db.query(query, values, (error, results) => {
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

// On form submission using the POST method, retreive the body information and update the table with the values.
router.post("/save__quote", [
  body('gallons').isFloat({ min: 0 }).withMessage('Gallons must be a positive number.'),
  body('deliveryDate').isAfter().withMessage('Please select a valid future date.'),
], (req,res) => {
	const gallons = req.body.gallons;
	const deliveryDate = req.body.deliveryDate;
	const price = req.body.price;
	const total = req.body.total;

	const query = "INSERT INTO FuelQuotes (userID, gallons, delivery) VALUES (1, ?, ?)";
	const values = [gallons, deliveryDate, price, total];

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