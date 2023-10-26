const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Endpoint to handle form submissions for Personal Information
app.post('/savePersonalInfo', (req, res) => {
    const { first_name, last_name, address_1, address_2, city, state, zipcode } = req.body;

    // Validate the data
    if (!first_name || !last_name || !address_1 || !city || !state || !zipcode) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Additional validation logic (e.g., length, format)

    // Prepare data for future DB integration
    const userData = {
        first_name,
        last_name,
        address_1,
        address_2,
        city,
        state,
        zipcode
    };

    // Save userData to DB (will be implemented later)

    res.json({ message: 'Data saved successfully.' });
});

// Endpoint to handle password reset
app.post('/resetPassword', (req, res) => {
    const { current_password, new_password, confirm_password } = req.body;

    // Validate the data
    if (!current_password || !new_password || !confirm_password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Additional validation logic (e.g., password strength)

    // Prepare data for future DB integration (if needed)
    const passwordData = {
        current_password,
        new_password,
        confirm_password
    };

    // Reset password logic (will be implemented later)

    res.json({ message: 'Password reset successful.' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
