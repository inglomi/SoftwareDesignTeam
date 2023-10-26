const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
// const mysql = require('mysql')
// const config = require('./config')

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.use(require('./routes/quoteform_backend'));
// app.use(require('./routes/login_backend'));

// const connection = mysql.createConnection(config.db);

// connection.connect(function(error){
//   if(error)
//   {
//       throw error;
//   }
//   else 
//   {
//       console.log("MySQL Database has connected successfully.")
//   }
// });

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, '/views/index.html');
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// module.exports = connection;
