const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req, res) => {
  res.render('index');
});
app.get("/create", (req, res) => {
  res.render("create")
})


// Start the server
const port = 3000;
const dburi =
  "mongodb+srv://anush:anush123@cluster0.pqnqxux.mongodb.net/nodetuts?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(dburi)
  .then((results) =>
    app.listen(process.env.Port || port, () =>
      console.log(`listening on port ${port}`)
    )
  )
  .catch((err) => console.log(err));
