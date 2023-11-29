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
	console.log(userID)
	var query = 'SELECT addressOne, addressTwo, city, state, zipCode FROM ClientInformation WHERE userID=?'; 
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


router.get('/get_quote', async (req, res) => {
    try {
        const userID = req.user.user_id;
        const rateHistoryQuery = 'SELECT quoteID FROM FuelQuotes WHERE UserID=?';
        const values = [userID];

        const hasRateHistory = await new Promise((resolve, reject) => {
            db.query(rateHistoryQuery, values, (error, results) => {
                if (error) {
                    console.error('Database error: ', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        console.log(hasRateHistory);

        const gallons = req.query.gallons;
		console.log(gallons)
        const state = req.query.state;

        const currentPrice = 1.50;
        const locationFactor = state === 'TX' ? 0.02 : 0.04;
        const rateHistoryFactor = hasRateHistory.length > 0 ? 0.01 : 0;
        const gallonsRequestedFactor = gallons > 1000 ? 0.02 : 0.03;
        const companyProfitFactor = 0.10;
        const margin = locationFactor - rateHistoryFactor + gallonsRequestedFactor + companyProfitFactor;
        const suggestedPrice = currentPrice + margin;
        const totalAmountDue = gallons * suggestedPrice;
		console.log(suggestedPrice);
		console.log(totalAmountDue);

        res.json({ suggestedPrice, totalAmountDue });
    } catch (error) {
        console.error('Error in route handler: ', error);
        res.status(500).send('Internal Server Error');
    }
});



// On form submission using the POST method, retreive the body information and update the table with the values.
router.post("/save__quote", [
  body('gallons').isFloat({ min: 0 }).withMessage('Gallons must be a positive number.'),
  body('deliveryDate').isAfter().withMessage('Please select a valid future date.'),
], (req,res) => {
	const userID = req.user.user_id;
	const gallons = req.body.gallons;
	const deliveryDate = req.body.deliveryDate;
	const price = req.body.price;
	const total = req.body.total;

	const query = "INSERT INTO FuelQuotes (userID, gallons, deliveryDate, price, total) VALUES (?, ?, ?, ?, ?)";
	const values = [userID, gallons, deliveryDate, price, total];

	console.log(values);

	db.query(query, values, (error, results) => {
		if (error) {
			console.error('Database error: ', error);
			res.status(500).send('Database error');
		}
		else {
			res.send('Data updated successfully');
		}
	});
});

module.exports = router;