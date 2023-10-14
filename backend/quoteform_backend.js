const express = require("express");
const PricingCalculator = require("../modules/pricing");
const app = express();
const port = 5500;

app.use(express.json());

// Simulated user profile data
const userProfileData = {
  userID: 'user123',
  address: "123 Main St",
  second__address: "Apt 4B",
  city: "New York",
  state: "NY",
  zip: "10001"
};

// API endpoint to get the user's address information to auto populate the quote form
app.get("/api/user/address", async (req, res) => {
    try {
      const userID = userProfileData.userID;
      const userAddressData = await fetchUserAddressFromDatabase(userID);

      if (userAddressData) {
        res.json(userAddressData);
      }
      else {
        //Hardcoded values until we set up database
        res.json(userProfileData)
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }

});
  
async function fetchUserAddressFromDatabase(userID) {
  //Database query
  return userProfileData;
}

// API endpoint to calculate and populate the prices
app.post("/api/user/estimate", async (req, res) => {
  const {gallons} = req.body;

  if (gallons) {
    const {pricePerGallon, totalAmountDue} = pricingCalculator.calculatePrice(gallons);
    res.json({pricePerGallon, totalAmountDue})
  }
  else {
    res.status(400).json({error: "Invalid data"});
  }
})

// API endpoint to save a new fuel quote
app.post("/api/quotes", (req, res) => {
  const {gallons, deliveryDate } = req.body;

  if (gallons && deliveryDate) {

    // Pricing formula here
    const {pricePerGallon, totalAmountDue} = pricingCalculator.calculatePrice(gallons);

    // Add the new quote to the list
    quoteHistory.push({ userId: userProfileData.userID, gallons, deliveryDate });
    res.status(201).json({ 
        message: "Quote saved successfully",
        suggestedPrice: pricePerGallon,
        totalAmountDue: totalAmountDue,
    });
  } else {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
