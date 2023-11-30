const express = require('express');
const app = express();
const mysql = require('mysql');

// Create a connection to the database
const connection = mysql.createConnection({
    host : "db4free.net",
    database : 'fuelquoteproject',
    user : 'team5fuelquote',
    password : '1caddf1a',
    secret: '8fa1dee245a27cc3c2e12c58634247df932b3582e79baa3f55430ce156999027c434b11e472681f1d134d932b42a37a45c8e394ce744dfa5ed475c2497990c23'
});

// Connect to the MySQL server
connection.connect((err) =>{
    if (err) {
        console.error('Error connecting to database: ' + err.message);
        return;
    }
    console.log('Connected to the database');
});
//Table generation
function generateTable(data){
    let html = '<table>';
    data.forEach(row => {
    html += '<tr>';
    Object.values(row).forEach(value => {
      html += `<td>${value}</td>`;
    });
    html += '</tr>';
  });
  html += '</table>';
  return html;
}
app.get('/sendData', (req, res) => {
    // Fetch data from the database
    connection.query('SELECT * FROM FuelQuotes', (error, results, fields) => {
        if (error) throw error;

        const qoute = results.map(row => {
          let qouteID = row.quoteID;
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
      
          return {qouteID,gallon_requested,address, state, zipcode, price_per_gallon, total,deliverydate}; 
          });

      // Pass the data to the HTML
      res.json(qoute);
    });
  });
app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});
  
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
