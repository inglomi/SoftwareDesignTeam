const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const fuelData = []; // Temporary data storage

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.post('/submitQuote', (req, res) => {
    const {
        gallons,
        address,
        secondAddress,
        city,
        state,
        zip,
        deliveryDate,
        price,
        total
    } = req.body;

    const quoteData = {
        gallons,
        address,
        secondAddress,
        city,
        state,
        zip,
        deliveryDate,
        price,
        total
    };

    fuelData.push(quoteData);

    res.json({ message: 'Quote submitted successfully.', quoteData });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
