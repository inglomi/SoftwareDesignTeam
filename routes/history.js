const express = require('express')
const app = express()
const router = express.Router();
const path = require("path");
const db = require('../database_connection');
const bodyParser = require('body-parser');

const authenticationMiddleware = require('../modules/userAuth')

app.use(express.urlencoded({ extended: false}));
router.use(bodyParser.urlencoded({ extended: true}));

router.get("/history", authenticationMiddleware(), (req, res) => {
	const filePath = path.join(__dirname, '../views/history.html')
	res.sendFile(filePath);
});

//Modifications 
router.get("/sendData", (req, res) => {
	const id = req.user.user_id;
	console.log(id);
	const query =
		"SELECT * FROM FuelQuotes WHERE userID = ?";
	  db.query(query, id, (err, results) => {
		if (err) {
		  throw error;
		} else {
		  const quote = results.map(row => {
			let quoteID = row.quoteID;
			let gallon_requested = row.gallons;
			let address = row.address;
			if (row.secondAddress != ''){
			  address = row.secondAddress + ","+row.address;
			}
			let state = row.city + ", "+row.state;
			let zipcode = row.zip;
			let price_per_gallon = row.price;
			let total = row.total;
			let date = row.deliveryDate;
			let deliverydate = date.toDateString();
		
			return {quoteID,gallon_requested,address, state, zipcode, price_per_gallon, total, deliverydate}; 
			});
			res.json(quote);
		}
	  });
  });

module.exports = router;
