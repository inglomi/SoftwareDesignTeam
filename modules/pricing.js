//Quote Form
document.getElementById('get_quote_btn').addEventListener('click', function() {
  const gallons = parseFloat(document.getElementById(gallons).value);
  const state = document.getElementById(state).value;

  const currentPrice = 1.50;
  const locationFactor = state === 'TX' ? 0.02 : 0.04;
  const rateHistoryFactor = hasRateHistory() ? 0.01 : 0;
  const gallonsRequestedFactor = gallons > 1000 ? 0.02 : 0.03;
  const companyProfitFactor = 0.10;
  const margin = (locationFactor - rateHistoryFactor + gallonsRequestedFactor + companyProfitFactor);
  const suggestedPrice = currentPrice + margin;
  const totalAmountDue = gallons * suggestedPrice;

  document.getElementById('price') = suggestedPrice.toFixed(3);
  document.getElementById('total') = totalAmountDue.toFixed(2);

})

module.exports = PricingCalculator;
