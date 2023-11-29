const express = require('express');
const router = express.Router();

router.post('/quote', (req, res) => {
  const { gallons, state } = req.body;

  // Implement pricing calculations here
  const currentPrice = 1.50;
  const locationFactor = state === 'TX' ? 0.02 : 0.04;
  const rateHistoryFactor = hasRateHistory() ? 0.01 : 0;
  const gallonsRequestedFactor = gallons > 1000 ? 0.02 : 0.03;
  const companyProfitFactor = 0.10;
  const margin = locationFactor - rateHistoryFactor + gallonsRequestedFactor + companyProfitFactor;
  const suggestedPrice = currentPrice + margin;
  console.log(suggestedPrice);
  const totalAmountDue = gallons * suggestedPrice;
  console.log(totalAmountDue)

  // Send the calculated values as JSON response
  res.json({ suggestedPrice, totalAmountDue });
});

module.exports = router;