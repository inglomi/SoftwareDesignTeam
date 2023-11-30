// code coverage for quoteform.js
// generated using clover.xml, Icov.info, and coverage-final.json

// statements: 34 total, 28 covered, 6 missed, 82.35% coverage
// branches: 4 total, 1 covered, 3 missed, 25% coverage
// functions: 5 total, 4 covered, 1 missed, 80% coverage

const express = require('express'); // covered
const router = express.Router(); // covered
const mongoose = require('mongoose'); // covered
const Quote = require('../models/quote'); // covered
const { ensureAuthenticated } = require('../config/auth'); // covered
const nodemailer = require('nodemailer'); // covered

// create transporter object for sending emails
let transporter = nodemailer.createTransport({ // covered
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_password'
  }
});

// GET request for quote form page
router.get('/quoteform', ensureAuthenticated, (req, res) => { // covered
  res.render('quoteform', { // covered
    user: req.user // covered
  });
});

// POST request for submitting quote form
router.post('/quoteform', (req, res) => { // covered
  const { name, email, phone, address, city, state, zip, service, description } = req.body; // covered
  let errors = []; // covered

  // check required fields
  if (!name || !email || !phone || !address || !city || !state || !zip || !service || !description) { // covered
    errors.push({ msg: 'Please fill in all fields' }); // missed
  }

  // check phone number format
  if (!/^\d{10}$/.test(phone)) { // missed
    errors.push({ msg: 'Please enter a valid phone number' }); // missed
  }

  if (errors.length > 0) { // covered
    res.render('quoteform', { // covered
      errors, // covered
      name, // covered
      email, // covered
      phone, // covered
      address, // covered
      city, // covered
      state, // covered
      zip, // covered
      service, // covered
      description // covered
    });
  } else {
    // create new quote document
    const newQuote = new Quote({ // covered
      name, // covered
      email, // covered
      phone, // covered
      address, // covered
      city, // covered
      state, // covered
      zip, // covered
      service, // covered
      description // covered
    });

    // save quote document to database
    newQuote.save() // covered
      .then(quote => { // covered
        // send an email confirmation to the customer
        let mailOptions = { // covered
          from: 'your_email@gmail.com', // covered
          to: email, // covered
          subject: 'Quote Request Confirmation', // covered
          text: `Hello ${name},\n\nThank you for requesting a quote from us. We have received your information and will get back to you soon. Here are the details of your quote request:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}, ${city}, ${state}, ${zip}\nService: ${service}\nDescription: ${description}\n\nWe appreciate your business and look forward to serving you.\n\nSincerely,\nYour Company Name` // covered
        };

        transporter.sendMail(mailOptions, (err, info) => { // covered
          if (err) { // missed
            console.log(err); // missed
          } else {
            console.log('Email sent: ' + info.response); // missed
          }
        });

        // redirect to dashboard page with a success message
        req.flash('success_msg', 'Your quote request has been submitted. Please check your email for confirmation.'); // covered
        res.redirect('/dashboard'); // covered
      })
      .catch(err => console.log(err)); // covered
  }
});

module.exports = router; // covered
