const express = require('express')
const app = express()
const router = express.Router();
const path = require("path");
const db = require('../database_connection');
const bodyParser = require('body-parser');

app.use(express.urlencoded({ extended: false}));
router.use(bodyParser.urlencoded({ extended: true}));

const authenticationMiddleware = require('../modules/userAuth')

router.get("/profile", authenticationMiddleware(), (req, res) => {
	const filePath = path.join(__dirname, '../views/profile.html')
	res.sendFile(filePath);
});
//get user information by userID to load in it the input box
router.get("/user_info/:id", (req, res) => {
  const { id } = req.params;

  const response = new Promise((resolve, reject) => {
    const query =
      "SELECT first_name, last_name, addressOne, addressTwo, city, state, zipCode FROM ClientInformation WHERE userID = ?";
    db.query(query, id, (err, results) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve(results);
      }
    });
  });
  response
    .then((data) => {
      res.json({ data: data }); //return this data in an array of objects
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

//update user information by ID
router.patch("/update_user_info/:id", (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, address1, address2, city, state, zipcode } =
    req.body;

  const query =
    "UPDATE ClientInformation SET first_name = ?, last_name = ?, addressOne = ?, addressTwo = ?, city = ?, state = ?, zipCode = ? WHERE userID = ?";
  db.query(
    query,
    [first_name, last_name, address1, address2, city, state, zipcode, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (result.affectedRows === 1) {
          res.json({ success: true });
        } else {
          res.json({
            success: false,
            message: "No user with the specified ID found.",
          });
        }
      }
    }
  );
});
module.exports = router;
