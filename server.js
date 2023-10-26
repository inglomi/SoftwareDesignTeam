const express = require("express");
const app = express();
const port = 8080;
const path = require("path");

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Import all route files
app.use(require('./routes/index'));
app.use(require('./routes/quoteform'));
app.use(require('./routes/login'));
app.use(require('./routes/registration'));
app.use(require('./routes/profile'));
app.use(require('./routes/history'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});