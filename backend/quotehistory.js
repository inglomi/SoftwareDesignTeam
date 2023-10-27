const express = require('express');
const app = express();
const mysql = require('mysql');

// Create a connection to the database
const connection = mysql.createConnection({
    host : "db4free.net",
    port: '3306',
    database : 'fuelquoteproject',
    user : 'team5fuelquote',
    password : '1caddf1a'
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
app.get('/', (req, res) => {
    // Fetch data from the database
    connection.query('SELECT * FROM your_table_name', (error, results, fields) => {
        if (error) throw error;

        const qoute = results.map(row => {
            const name = row.fullname;
            const date = row.qouteDate;
            const gallon_requested = row.gallonRequested;
            const address = row.Address1;
            if (row.Address2 == ''){
                address = row.Address2 + ","+row.Address1;
            }
            const price = suggestedPrice;
            const state = row.City + ", "+row.state;
            const zipcode = row.Zipcode;
            const price_per_gallon = price / gallon_requested ;
            const deliverydate = row.deliveryDate;
      
            return {name, date,gallon_requested,address, state, zipcode, price_per_gallon, deliverydate}; 
          });
      // Pass the data to the HTML template
      res.send(`<html><body>${generateTable(qoute)}</body></html>`);
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

